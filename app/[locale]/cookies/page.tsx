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
        title: metadata.cookiesTitle || "Cookie Policy",
        description: metadata.cookiesDescription || "Learn how Gent bandenservice uses cookies and how you can manage your preferences.",
        alternates: {
            canonical: `/${locale}/cookies`,
            languages: getAlternateLanguages('/cookies'),
        },
    };
}

export default async function CookiesPage() {
    const t = await getTranslations('CookiePolicy');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
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

                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('what.title')}</h2>
                                <p className="mb-4">{t('what.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('types.title')}</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>{t('types.essential')}</li>
                                    <li>{t('types.analytics')}</li>
                                    <li>{t('types.support')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('manage.title')}</h2>
                                <p className="mb-4">{t('manage.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('thirdParty.title')}</h2>
                                <p className="mb-4">{t('thirdParty.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('updates.title')}</h2>
                                <p className="mb-4">{t('updates.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
                                <p className="mb-4">{t('contact.content')}</p>
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
