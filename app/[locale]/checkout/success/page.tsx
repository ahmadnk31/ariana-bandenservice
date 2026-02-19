'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/app/components/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { CheckCircle, ShoppingBag } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const t = useTranslations('Checkout');
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        // Clear the cart on successful checkout
        clearCart();

        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            // Optionally fetch order details
            setOrderNumber(sessionId.slice(-8).toUpperCase());
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{t('successTitle')}</h1>
                    <p className="text-muted-foreground mb-6">
                        {t('successMessage')}
                    </p>

                    {orderNumber && (
                        <div className="bg-muted rounded-lg p-4 mb-6">
                            <p className="text-sm text-muted-foreground">{t('orderNumber')}</p>
                            <p className="text-lg font-mono font-bold">AB-{orderNumber}</p>
                        </div>
                    )}

                    <Link
                        href="/tires"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {t('continueShopping')}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
