'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/components/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import { ShoppingCart, Truck, CreditCard, ArrowLeft, Package, Store } from 'lucide-react';

interface ShippingRate {
    id: string;
    carrier: 'pickup' | 'dhl' | 'gls';
    method: 'pickup' | 'standard' | 'express';
    name: string;
    price: number;
    deliveryDays: string;
    description: string;
}

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const t = useTranslations('Checkout');
    const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
    const [selectedRate, setSelectedRate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'BE',
    });

    // Fetch shipping rates
    useEffect(() => {
        async function fetchRates() {
            try {
                const res = await fetch(`/api/shipping/rates?country=${formData.country}`);
                const data = await res.json();
                setShippingRates(data.rates || []);
                if (data.rates?.length > 0 && !selectedRate) {
                    setSelectedRate(data.rates[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch shipping rates', error);
            }
        }
        fetchRates();
    }, [formData.country]);

    const selectedShippingRate = shippingRates.find(r => r.id === selectedRate);
    const shippingCost = selectedShippingRate?.price || 0;
    const total = subtotal + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShippingRate || items.length === 0) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    shippingOption: {
                        carrier: selectedShippingRate.carrier,
                        method: selectedShippingRate.method,
                        name: selectedShippingRate.name,
                        price: selectedShippingRate.price,
                        deliveryDays: selectedShippingRate.deliveryDays,
                    },
                    shippingAddress: formData,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to process checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                        <h1 className="text-2xl font-bold mb-2">{t('emptyCart')}</h1>
                        <Link
                            href="/tires"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToShop')}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const countries = [
        { code: 'BE', name: 'Belgium' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'LU', name: 'Luxembourg' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-muted/30 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column: Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-background rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t('shippingAddress')}</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('firstName')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('lastName')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('email')}</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('phone')}</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1.5">{t('street')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.street}
                                                onChange={e => setFormData({ ...formData, street: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('city')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('postalCode')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.postalCode}
                                                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('country')}</label>
                                            <select
                                                required
                                                value={formData.country}
                                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            >
                                                {countries.map(c => (
                                                    <option key={c.code} value={c.code}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Method */}
                                <div className="bg-background rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t('shippingMethod')}</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {shippingRates.map(rate => (
                                            <label
                                                key={rate.id}
                                                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedRate === rate.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-muted-foreground/30'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    value={rate.id}
                                                    checked={selectedRate === rate.id}
                                                    onChange={e => setSelectedRate(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${rate.carrier === 'pickup' ? 'bg-green-100' : 'bg-muted'}`}>
                                                    {rate.carrier === 'pickup' ? (
                                                        <Store className="w-6 h-6 text-green-600" />
                                                    ) : (
                                                        <span className="font-bold text-xs uppercase">{rate.carrier}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{rate.name}</p>
                                                    <p className="text-sm text-muted-foreground">{rate.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    {rate.price === 0 ? (
                                                        <p className="font-bold text-green-600">FREE</p>
                                                    ) : (
                                                        <p className="font-semibold">€{rate.price.toFixed(2)}</p>
                                                    )}
                                                    {rate.carrier !== 'pickup' && (
                                                        <p className="text-sm text-muted-foreground">{rate.deliveryDays} days</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-background rounded-xl p-6 shadow-sm sticky top-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t('orderSummary')}</h2>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-medium text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <hr className="border-muted mb-4" />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('subtotal')}</span>
                                            <span>€{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('shipping')}</span>
                                            <span>€{shippingCost.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <hr className="border-muted my-4" />

                                    <div className="flex justify-between text-lg font-bold mb-6">
                                        <span>{t('total')}</span>
                                        <span>€{total.toFixed(2)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !selectedRate}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t('processing')}
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                {t('payNow')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main >

            <Footer />
        </div >
    );
}
