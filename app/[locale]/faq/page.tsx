import { useTranslations } from 'next-intl';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FAQPage() {
    const t = useTranslations('FAQ');

    const sections = [
        'services',
        'prices_used',
        'prices_new',
        'replacement',
        'seasonal',
        'balancing_alignment',
        'tpms',
        'repair',
        'recycling',
        'hours',
        'payment',
        'why_us',
        'contact'
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4 text-center">{t('title')}</h1>
                    <p className="text-center text-muted-foreground mb-12">{t('subtitle')}</p>

                    <div className="space-y-4">
                        {sections.map((section, index) => (
                            <details key={index} className="group border border-muted rounded-lg bg-card open:ring-1 open:ring-primary/20">
                                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-lg text-primary select-none group-open:border-b group-open:border-muted">
                                    {t(`questions.${section}`)}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </summary>
                                <div className="p-6 pt-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {t(`questions.${section}_text`)}
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className="mt-16 text-center bg-muted/30 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                        <a href="/contact" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
