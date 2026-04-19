import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Link } from "@/src/i18n/routing";

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/hero.png"
                            alt="About Gent Bandenservice"
                            fill
                            className="object-cover brightness-[0.3]"
                            priority
                        />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full uppercase tracking-wider">
                                    {t('storyTitle')}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                    {t('storyHeading')}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {t('storyText')}
                                </p>
                            </div>
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                                <Image
                                    src="/front-shop.jpeg"
                                    alt="Our Shop"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                    <p className="text-white font-medium text-lg">{t('locationText')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full uppercase tracking-wider">
                                {t('missionTitle')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                                {t('missionHeading')}
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed italic">
                                "{t('missionText')}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-widest">
                                {t('valuesTitle')}
                            </h2>
                            <div className="w-24 h-1 bg-primary mx-auto"></div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Quality */}
                            <div className="p-8 bg-muted/20 border border-muted rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-6 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t('valueQualityTitle')}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('valueQualityDesc')}
                                </p>
                            </div>
                            {/* Affordability */}
                            <div className="p-8 bg-muted/20 border border-muted rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-6 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t('valuePriceTitle')}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('valuePriceDesc')}
                                </p>
                            </div>
                            {/* Speed & Service */}
                            <div className="p-8 bg-muted/20 border border-muted rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-6 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t('valueServiceTitle')}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('valueServiceDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {t('ctaTitle')}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/tires"
                                className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors uppercase tracking-wider"
                            >
                                {t('ctaBtn')}
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider"
                            >
                                {t('ctaContactBtn')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
