"use client";

import { useCart, type CartItem } from './CartContext';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import { useState } from 'react';
import StockRequestModal from './StockRequestModal';

interface ProductAddToCartProps {
    tire: Omit<CartItem, 'quantity'>;
}

export default function ProductAddToCart({ tire }: ProductAddToCartProps) {
    const { addToCart } = useCart();
    const t = useTranslations('Cart');
    const [isAdding, setIsAdding] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [withMounting, setWithMounting] = useState(false);
    const tTires = useTranslations('Tires');

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(tire as any, undefined, withMounting);

        // Show success state briefly
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <>
            {tire.stock > 0 && (
                <div className="mb-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={withMounting}
                                onChange={(e) => setWithMounting(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-primary transition-all checked:bg-primary"
                            />
                            <svg
                                className="pointer-events-none absolute h-5 w-5 p-1 text-white opacity-0 peer-checked:opacity-100"
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
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {tTires('mountingOption')}
                            </span>
                        </div>
                    </label>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={tire.stock === 0 ? () => setIsRequestModalOpen(true) : handleAddToCart}
                    disabled={isAdding}
                    className={`
                        w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-sm
                        ${tire.stock === 0
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                        }
                    `}
                >
                    {tire.stock > 0 && <ShoppingCart className="w-5 h-5" />}
                    {tire.stock === 0
                        ? tTires('requestStock')
                        : isAdding
                            ? t('added')
                            : t('addToCart')
                    }
                </button>

                <Link
                    href={{ pathname: '/appointment', query: { tireId: tire.id, tireName: tire.name } }}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary/10 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {tTires('makeAppointment')}
                </Link>
            </div>

            {isRequestModalOpen && (
                <StockRequestModal
                    tireId={tire.id}
                    tireName={tire.name}
                    onClose={() => setIsRequestModalOpen(false)}
                />
            )}
        </>
    );
}
