'use client';

import { useCart } from './CartContext';
import Price from './Price';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/src/i18n/routing';

import { useTranslations } from 'next-intl';
import SeasonIcon from './SeasonIcon';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        toggleMounting,
        subtotal,
        cartCount
    } = useCart();
    const t = useTranslations('Cart');
    const tTires = useTranslations('Tires');

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <h2 className="font-semibold text-lg">{t('title')}</h2>
                        {cartCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label={t('close')}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                            <p className="text-lg font-medium">{t('empty')}</p>
                            <p className="text-sm mt-1">{t('emptySubtitle')}</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map(item => {
                                const increment = item.incrementBy || 2;
                                const canDecrement = item.quantity > increment;
                                const canIncrement = item.quantity + increment <= item.stock;

                                return (
                                    <li key={item.id} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <ShoppingCart className="w-8 h-8 opacity-30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={{ pathname: '/tires/[slug]', params: { slug: item.slug } }}
                                                className="font-medium text-sm hover:text-primary line-clamp-1"
                                                onClick={closeCart}
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5 uppercase tracking-wide">
                                                <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded leading-none">
                                                    <SeasonIcon season={item.season} size="md" />
                                                    <span className="text-[10px] font-bold">
                                                        {item.season === 'summer' ? 'Zomer' : item.season === 'winter' ? 'Winter' : '4-Seizoen'}
                                                    </span>
                                                </div>
                                                <span>{item.brand} • {item.size}</span>
                                            </div>
                                            <p className="font-semibold mt-1"><Price amount={item.price} size="base" /></p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => decrementQuantity(item.id)}
                                                    disabled={!canDecrement}
                                                    className="w-7 h-7 flex items-center justify-center bg-muted rounded hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={t('decrease')}
                                                    title={`-${increment}`}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => incrementQuantity(item.id)}
                                                    disabled={!canIncrement}
                                                    className="w-7 h-7 flex items-center justify-center bg-muted rounded hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={t('increase')}
                                                    title={`+${increment}`}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                                    aria-label={t('remove')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Increment indicator */}
                                            {increment > 1 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t('incrementBy', { count: increment }) || `Increments of ${increment}`}
                                                </p>
                                            )}

                                            {/* Mounting status */}
                                            <div className="mt-3 p-2 rounded border border-primary/20 bg-primary/5">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.withMounting}
                                                            onChange={() => toggleMounting(item.id)}
                                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-primary transition-all checked:bg-primary"
                                                        />
                                                        <svg
                                                            className="pointer-events-none absolute h-4 w-4 p-0.5 text-white opacity-0 peer-checked:opacity-100"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-foreground group-hover:text-primary transition-colors uppercase">
                                                        {t('mountingService')} (+<Price amount={19.85 * item.quantity} size="sm" />)
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{t('subtotal')}</span>
                            <Price amount={subtotal} size="lg" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t('shippingNote')}</p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            {t('checkout')}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}