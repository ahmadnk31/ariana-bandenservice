'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/app/components/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { CheckCircle, ShoppingBag, Star } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const t = useTranslations('Checkout');
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        // Clear the cart on successful checkout
        clearCart();

        const sessionId = searchParams.get('session_id');
        const bankOrder = searchParams.get('order');
        
        if (sessionId) {
            setOrderNumber(sessionId.slice(-8).toUpperCase());
        } else if (bankOrder) {
            setOrderNumber(bankOrder.replace('AB-', ''));
        }
    }, [searchParams, clearCart]);

    const isBankTransfer = searchParams.get('method') === 'bank_transfer';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        {isBankTransfer ? t('successTitleBank') : t('successTitle')}
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {isBankTransfer 
                            ? t('successMessageBank')
                            : t('successMessage')}
                    </p>

                    {orderNumber && (
                        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('orderNumber')}</p>
                            <p className="text-lg font-mono font-bold">AB-{orderNumber}</p>
                            
                            {isBankTransfer && (
                                <div className="mt-4 pt-4 border-t border-muted-foreground/10">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* QR Code Section */}
                                        <div className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-muted">
                                            {(() => {
                                                const amount = searchParams.get('amount') || '0';
                                                const epcData = [
                                                    'BCD',
                                                    '002',
                                                    '1',
                                                    'SCT',
                                                    '', // BIC optional
                                                    'Elyas Nekzad',
                                                    'BE48950227454827',
                                                    `EUR${parseFloat(amount).toFixed(2)}`,
                                                    '', // Purpose optional
                                                    `AB-${orderNumber}`,
                                                    '', // Unstructured
                                                    ''  // Info
                                                ].join('\n');
                                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(epcData)}`;
                                                
                                                return (
                                                    <div className="relative group">
                                                        <img 
                                                            src={qrUrl} 
                                                            alt="Payment QR Code" 
                                                            className="w-40 h-40"
                                                        />
                                                        <div className="absolute inset-0 bg-background/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-[10px] bg-background/80 px-2 py-1 rounded shadow-sm">{t('scanBankApp')}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter text-center">
                                                {t('scanToPay')}
                                            </p>
                                        </div>

                                        {/* Manual Details Section */}
                                        <div className="flex-1 space-y-3">
                                            <p className="text-sm font-semibold text-primary">{t('manualTransfer')}</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('accountHolder')}</p>
                                                    <p className="text-sm font-medium">Elyas Nekzad</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">IBAN</p>
                                                    <p className="text-sm font-mono font-bold select-all">BE48 9502 2745 4827</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('reference')}</p>
                                                    <p className="text-sm font-mono font-bold select-all">AB-{orderNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                                        <p className="text-[11px] text-amber-800 leading-relaxed italic">
                                            {t('bankInstruction')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Google Review CTA */}
                    <div className="mb-8 p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star className="w-16 h-16 fill-primary text-primary rotate-12" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 relative z-10">
                            {useTranslations('Home')('reviews.successCTA')}
                        </h3>
                        <a 
                            href="https://www.google.com/maps/place/ARIANA+Bandenservice/@51.0516972,3.7536583,748m/data=!3m1!1e3!4m8!3m7!1s0x47c37700051d85b7:0xcde1d6416f99d9f2!8m2!3d51.0516972!4d3.7562332!9m1!1b1!16s%2Fg%2F11y4yrfhx1?authuser=0&entry=ttu" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#F59E0B] text-white font-bold hover:bg-[#D97706] transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5l3.09 6.26L22 8.74l-5 4.87 1.18 6.88L12 17.25l-6.18 3.24L7 13.61l-5-4.87 6.91-0.98L12 1.5z"/></svg>
                            {useTranslations('Home')('reviews.reviewUs')}
                        </a>
                    </div>

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
