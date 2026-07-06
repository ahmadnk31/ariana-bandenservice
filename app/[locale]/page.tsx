import { prisma } from "@/lib/db";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Footer from "@/app/components/Footer";
import TireCard from "@/app/components/TireCard";
import ReviewsSection from "@/app/components/ReviewsSection";
import TopBrands from "@/app/components/TopBrands";
import TopSizes from "@/app/components/TopSizes";
import WorkshopStrip from "@/app/components/WorkshopStrip";

import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/routing';
import { Metadata } from "next";

export const revalidate = 0; // Ensure fresh data for "New" section

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      absolute: t('title'),
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
    }
  };
}

export default async function Home() {
  const t = await getTranslations('Home');

  const recentTires = await prisma.tire.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" }
      }
    },
  });

  const parsedTires = recentTires.map((tire) => ({
    ...tire,
    features: JSON.parse(tire.features) as string[],
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        {/* Workshop stats strip */}
        <WorkshopStrip />

        {/* Recent Tires Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
              </div>
              <Link href="/tires" className="group flex items-center text-primary font-medium hover:underline">
                {t('viewDetails')}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>

            {parsedTires.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {parsedTires.map((tire) => (
                  <TireCard key={tire.id} {...tire} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('noResults')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Secondhand Tires Promo Banner */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 md:p-12 shadow-2xl">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-white" />
                <div className="absolute -bottom-12 -left-12 w-80 h-80 rounded-full bg-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Text */}
                <div className="text-white text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Top deal
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    Tweedehands Banden
                  </h2>
                  <p className="text-white/90 text-lg max-w-md mb-6">
                    Kwaliteitsbanden aan de beste prijs — inclusief montage &amp; balanceren. Maten van 13&quot; tot 21&quot;.
                  </p>

                  {/* Price highlights */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    {[
                      { inch: '13"–15"', price: '€25–€40' },
                      { inch: '16"–18"', price: '€40–€55' },
                      { inch: '19"–21"', price: '€50–€70' },
                    ].map((item) => (
                      <div key={item.inch} className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                        <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">{item.inch}</div>
                        <div className="text-lg font-extrabold">{item.price}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/secondhand-tires"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm uppercase tracking-wider"
                  >
                    Bekijk tweedehands banden
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>

                {/* Right: Icon */}
                <div className="hidden md:flex items-center justify-center flex-shrink-0">
                  <div className="w-40 h-40 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/>
                      <line x1="19" y1="12" x2="22" y2="12"/>
                      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/>
                      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
                      <line x1="19.07" y1="4.93" x2="16.95" y2="7.05"/>
                      <line x1="7.05" y1="16.95" x2="4.93" y2="19.07"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Sizes Section */}
        <TopSizes />

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-muted hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('quality')}</h3>
                <p className="text-muted-foreground">{t('qualityText')}</p>
              </div>
              <div className="p-6 rounded-lg border border-muted hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('experience')}</h3>
                <p className="text-muted-foreground">{t('experienceText')}</p>
              </div>
              <div className="p-6 rounded-lg border border-muted hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('service')}</h3>
                <p className="text-muted-foreground">{t('serviceText')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Brands Section */}
        <TopBrands />

        {/* Reviews Section */}
        <ReviewsSection />


      </main>
      <Footer />
    </div>
  );
}
