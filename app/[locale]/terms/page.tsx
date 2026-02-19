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
        title: metadata.termsTitle || "Terms of Service",
        description: metadata.termsDescription || "Terms of service for Gent bandenservice. Read our terms and conditions for using our tire services.",
        alternates: {
            canonical: `/${locale}/terms`,
            languages: getAlternateLanguages('/terms'),
        },
    };
}

export default async function TermsPage() {
    const t = await getTranslations('Terms');

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
                                <h2 className="text-2xl font-bold mb-4">{t('acceptance.title')}</h2>
                                <p className="mb-4">{t('acceptance.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('services.title')}</h2>
                                <p className="mb-4">{t('services.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('services.tireInstallation')}</li>
                                    <li>{t('services.tireRepair')}</li>
                                    <li>{t('services.wheelBalancing')}</li>
                                    <li>{t('services.wheelAlignment')}</li>
                                    <li>{t('services.tireSales')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('booking.title')}</h2>
                                <p className="mb-4">{t('booking.content')}</p>
                                <p className="mb-4">{t('booking.cancellation')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('payment.title')}</h2>
                                <p className="mb-4">{t('payment.content')}</p>
                                <p className="mb-4">{t('payment.methods')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('warranty.title')}</h2>
                                <p className="mb-4">{t('warranty.content')}</p>
                                <p className="mb-4">{t('warranty.tires')}</p>
                                <p className="mb-4">{t('warranty.services')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('liability.title')}</h2>
                                <p className="mb-4">{t('liability.content')}</p>
                                <p className="mb-4">{t('liability.limitation')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('intellectualProperty.title')}</h2>
                                <p className="mb-4">{t('intellectualProperty.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('privacy.title')}</h2>
                                <p className="mb-4">{t('privacy.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('termination.title')}</h2>
                                <p className="mb-4">{t('termination.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
                                <p className="mb-4">{t('changes.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('governing.title')}</h2>
                                <p className="mb-4">{t('governing.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
                                <p className="mb-4">{t('contact.content')}</p>
                                <p className="mb-4">{t('contact.email')}</p>
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