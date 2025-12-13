'use client';

import { useCart } from './CartContext';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, cartCount } = useCart();
    const t = useTranslations('Cart');

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
                            {items.map(item => (
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
                                            href={`/tires/${item.slug}`}
                                            className="font-medium text-sm hover:text-primary line-clamp-1"
                                            onClick={closeCart}
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.brand} • {item.size}
                                        </p>
                                        <p className="font-semibold mt-1">€{item.price.toFixed(2)}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity === 1}
                                                className="w-7 h-7 flex items-center justify-center bg-muted rounded hover:bg-muted/80 transition-colors"
                                                aria-label={t('decrease')}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-7 h-7 flex items-center justify-center bg-muted rounded hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={t('increase')}
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
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{t('subtotal')}</span>
                            <span className="text-xl font-bold">€{subtotal.toFixed(2)}</span>
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
