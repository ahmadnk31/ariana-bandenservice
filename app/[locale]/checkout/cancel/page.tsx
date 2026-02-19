'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
    const t = useTranslations('Checkout');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{t('cancelTitle')}</h1>
                    <p className="text-muted-foreground mb-6">
                        {t('cancelMessage')}
                    </p>

                    <Link
                        href="/checkout"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('tryAgain')}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
