import { getTranslations } from 'next-intl/server';
import { getAlternateLanguages } from "@/lib/utils";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    return {
        title: metadata.returnPolicyTitle || "Return Policy",
        description: metadata.returnPolicyDescription || "Return policy for online tire purchases at Gent bandenservice.",
        alternates: {
            canonical: `/${locale}/return-policy`,
            languages: getAlternateLanguages('/return-policy'),
        },
    };
}

export default async function ReturnPolicyPage() {
    const t = await getTranslations('ReturnPolicy');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('eligibility.title')}</h2>
                                <p className="mb-4">{t('eligibility.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('timeframe.title')}</h2>
                                <p className="mb-4">{t('timeframe.content')}</p>
                                <p className="mb-4">{t('timeframe.startDate')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('conditions.title')}</h2>
                                <p className="mb-4">{t('conditions.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('conditions.unused')}</li>
                                    <li>{t('conditions.unmounted')}</li>
                                    <li>{t('conditions.originalPackaging')}</li>
                                    <li>{t('conditions.withReceipt')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('process.title')}</h2>
                                <p className="mb-4">{t('process.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('process.step1')}</li>
                                    <li>{t('process.step2')}</li>
                                    <li>{t('process.step3')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('refunds.title')}</h2>
                                <p className="mb-4">{t('refunds.content')}</p>
                                <p className="mb-4">{t('refunds.method')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('exceptions.title')}</h2>
                                <p className="mb-4">{t('exceptions.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('exceptions.mounted')}</li>
                                    <li>{t('exceptions.used')}</li>
                                    <li>{t('exceptions.customOrders')}</li>
                                    <li>{t('exceptions.damaged')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('shippingCosts.title')}</h2>
                                <p className="mb-4">{t('shippingCosts.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('exchanges.title')}</h2>
                                <p className="mb-4">{t('exchanges.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
                                <p className="mb-4">{t('contact.content')}</p>
                                <p className="mb-4">{t('contact.email')}</p>
                                <p className="mb-4">{t('contact.phone')}</p>
                            </section>

                            <section className="mb-8">
                                <p className="text-sm text-muted-foreground">
                                    {t('lastUpdated')}: {t('lastUpdatedDate')}
                                </p>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
