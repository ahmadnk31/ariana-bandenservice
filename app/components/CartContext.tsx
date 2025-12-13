'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    slug: string;
    brand: string;
    size: string;
    price: number;
    quantity: number;
    image?: string;
    stock: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ariana-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id);
            if (existing) {
                // Don't exceed stock
                const newQuantity = Math.min(existing.quantity + quantity, item.stock);
                return current.map(i =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                );
            }
            return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setItems(current => current.filter(i => i.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setItems(current =>
            current.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: Math.min(quantity, item.stock) };
                }
                return item;
            })
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                subtotal,
                isOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
