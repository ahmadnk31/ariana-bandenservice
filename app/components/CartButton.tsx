'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartButton() {
    const { openCart, cartCount } = useCart();

    return (
        <button
            onClick={openCart}
            className="relative p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Open cart"
        >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                </span>
            )}
        </button>
    );
}
