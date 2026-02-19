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
    incrementBy?: number; // Default: 2 for tires, can be 1 or 4
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    incrementQuantity: (itemId: string) => void;
    decrementQuantity: (itemId: string) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
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
                const parsedItems = JSON.parse(stored);
                setItems(parsedItems);
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
                localStorage.removeItem(CART_STORAGE_KEY);
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

    // Add item to cart
    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity?: number) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id);
            const increment = item.incrementBy || 2; // Default to 2 for tires
            const addQuantity = quantity !== undefined ? quantity : increment;

            if (existing) {
                // Check if we can add more
                if (existing.quantity >= item.stock) {
                    return current; // Already at stock limit
                }

                // Add by increment amount, respecting stock
                const newQuantity = Math.min(existing.quantity + addQuantity, item.stock);

                setIsOpen(true);
                return current.map(i =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                );
            }

            // New item - start with specified quantity or increment amount
            const initialQuantity = Math.min(addQuantity, item.stock);
            setIsOpen(true);
            return [...current, { ...item, quantity: initialQuantity }];
        });
    }, []);

    // Remove item from cart
    const removeFromCart = useCallback((itemId: string) => {
        setItems(current => current.filter(i => i.id !== itemId));
    }, []);

    // Update quantity directly (for manual input)
    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setItems(current =>
            current.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.min(quantity, item.stock);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    }, [removeFromCart]);

    // Increment quantity by incrementBy value
    const incrementQuantity = useCallback((itemId: string) => {
        setItems(current =>
            current.map(item => {
                if (item.id === itemId) {
                    const increment = item.incrementBy || 2; // Default to 2 for tires
                    const newQuantity = Math.min(item.quantity + increment, item.stock);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    }, []);

    // Decrement quantity by incrementBy value
    const decrementQuantity = useCallback((itemId: string) => {
        setItems(current => {
            return current
                .map(item => {
                    if (item.id === itemId) {
                        const increment = item.incrementBy || 2; // Default to 2 for tires
                        const newQuantity = item.quantity - increment;

                        // Remove item if quantity would be 0 or negative
                        if (newQuantity <= 0) {
                            return null;
                        }

                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null);
        });
    }, []);

    // Clear entire cart
    const clearCart = useCallback(() => {
        setItems([]);
        setIsOpen(false);
    }, []);

    // Calculate totals
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Cart drawer controls
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                incrementQuantity,
                decrementQuantity,
                clearCart,
                cartCount,
                subtotal,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
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