import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Timer, Wrench, ShieldCheck, FileText } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    return {
        title: metadata.b2bTitle || "B2B Partnerschappen",
        description: metadata.b2bDescription || "Werk met ons samen voor betrouwbare bandenoplossingen voor het controleren en onderhouden van bedrijfswagens.",
        alternates: {
            canonical: `/${locale}/b2b`,
            languages: getAlternateLanguages('/b2b'),
        },
    };
}

export default async function B2BPage() {
    const t = await getTranslations('B2B');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-muted/50 border-b border-muted">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Features / Benefits Grid */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('whyPartner')}</h2>
                            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl border border-muted bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                    <Timer size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('feature1Title')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('feature1Desc')}</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl border border-muted bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                    <Wrench size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('feature2Title')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('feature2Desc')}</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl border border-muted bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('feature3Title')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('feature3Desc')}</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-8 rounded-2xl border border-muted bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('feature4Title')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('feature4Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="py-16 bg-muted/30 border-t border-muted">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
                            {t('trustedBy')}
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-2xl font-black text-foreground/80 tracking-tighter">AG Insurance</span>
                            <span className="text-2xl font-bold text-blue-900 tracking-tight">AXA</span>
                            <span className="text-2xl font-extrabold text-blue-800 tracking-wide">Baloise</span>
                            <span className="text-2xl font-bold text-red-700 italic">Ethias</span>
                            <span className="text-2xl font-bold text-blue-900 tracking-tighter">Allianz</span>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-background border-t border-muted">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight">{t('statsTitle')}</h2>
                            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-black text-primary mb-2">15+</p>
                                <p className="text-muted-foreground font-medium">{t('stat1Label')}</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-black text-primary mb-2">50+</p>
                                <p className="text-muted-foreground font-medium">{t('stat2Label')}</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-black text-primary mb-2">10k+</p>
                                <p className="text-muted-foreground font-medium">{t('stat3Label')}</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-black text-primary mb-2">99%</p>
                                <p className="text-muted-foreground font-medium">{t('stat4Label')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('ctaTitle')}</h2>
                        <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
                            {t('ctaDesc')}
                        </p>
                        <Link
                            href={{ pathname: '/contact', query: { service: 'B2B Partnership' } }}
                            className="inline-flex h-14 items-center justify-center rounded-xl bg-background px-10 text-lg font-bold text-foreground shadow hover:bg-muted transition-colors"
                        >
                            {t('ctaBtn')}
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
