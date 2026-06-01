import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "@/src/i18n/routing";
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { getAlternateLanguages } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Tires' });
    const metadata = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: `${t('secondHand')} | ${metadata('title').split('|')[0].trim() || 'Gent Bandenservice'}`,
        description: t('subtitle'),
        alternates: {
            canonical: `/${locale}/secondhand-tires`,
            languages: getAlternateLanguages('/secondhand-tires'),
        },
    };
}

export default async function SecondhandTiresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Tires' });
    
    // All sizes from 13 up to 24
    const sizes = Array.from({ length: 12 }, (_, i) => i + 13);
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                            {t('secondHand')}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                            {t('secondHand')} {t('size')} 13" - 24"
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
                        {sizes.map(size => (
                            <Link 
                                key={size}
                                href={{ pathname: '/secondhand-tires/[rimSize]', params: { rimSize: size.toString() } }}
                                className="group relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-muted bg-card hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="text-5xl md:text-6xl font-black text-foreground group-hover:text-primary transition-colors mb-2">
                                        {size}"
                                    </div>
                                    <div className="text-xs md:text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                                        {t('size')} {size}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
