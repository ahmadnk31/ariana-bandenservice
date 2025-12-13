'use client';

import { useCart, CartItem } from './CartContext';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ProductAddToCartProps {
    tire: Omit<CartItem, 'quantity'>;
}

export default function ProductAddToCart({ tire }: ProductAddToCartProps) {
    const { addToCart } = useCart();
    const t = useTranslations('Cart');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(tire);

        // Show success state briefly
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={tire.stock === 0 || isAdding}
            className={`
                w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
                ${tire.stock === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                }
            `}
        >
            <ShoppingCart className="w-5 h-5" />
            {tire.stock === 0
                ? t('outOfStock')
                : isAdding
                    ? t('added')
                    : t('addToCart')
            }
        </button>
    );
}
