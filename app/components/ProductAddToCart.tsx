"use client";

import { useCart, type CartItem } from './CartContext';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
    const tTires = useTranslations('Tires');

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(tire);

        // Show success state briefly
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <>
            <button
                onClick={tire.stock === 0 ? () => setIsRequestModalOpen(true) : handleAddToCart}
                disabled={isAdding}
                className={`
                    w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-sm
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
