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
        title: metadata.privacyTitle || "Privacy Policy",
        description: metadata.privacyDescription || "Privacy policy for Gent bandenservice. Learn how we collect, use, and protect your personal information.",
        alternates: {
            canonical: `/${locale}/privacy`,
            languages: getAlternateLanguages('/privacy'),
        },
    };
}

export default async function PrivacyPage() {
    const t = await getTranslations('Privacy');

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
                                <h2 className="text-2xl font-bold mb-4">{t('dataCollection.title')}</h2>
                                <p className="mb-4">{t('dataCollection.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('dataCollection.personalInfo')}</li>
                                    <li>{t('dataCollection.contactInfo')}</li>
                                    <li>{t('dataCollection.vehicleInfo')}</li>
                                    <li>{t('dataCollection.serviceInfo')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('dataUsage.title')}</h2>
                                <p className="mb-4">{t('dataUsage.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('dataUsage.provideServices')}</li>
                                    <li>{t('dataUsage.processBookings')}</li>
                                    <li>{t('dataUsage.communication')}</li>
                                    <li>{t('dataUsage.improve')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('dataSharing.title')}</h2>
                                <p className="mb-4">{t('dataSharing.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('dataSecurity.title')}</h2>
                                <p className="mb-4">{t('dataSecurity.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('userRights.title')}</h2>
                                <p className="mb-4">{t('userRights.content')}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('userRights.access')}</li>
                                    <li>{t('userRights.rectification')}</li>
                                    <li>{t('userRights.erasure')}</li>
                                    <li>{t('userRights.portability')}</li>
                                    <li>{t('userRights.objection')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('cookies.title')}</h2>
                                <p className="mb-4">{t('cookies.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
                                <p className="mb-4">{t('contact.content')}</p>
                                <p className="mb-4">{t('contact.email')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('updates.title')}</h2>
                                <p className="mb-4">{t('updates.content')}</p>
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