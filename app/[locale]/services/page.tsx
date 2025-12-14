import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Wrench, Disc, Timer, Layers, Settings, Search, Clock, Euro } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/routing';

export const metadata: Metadata = {
    title: "Services | Ariana Bandenservice",
    description: "Professional tire services including fitting, balancing, wheel alignment, and puncture repair.",
};

// Map icon strings to Lucide components
const IconMap: Record<string, any> = {
    "wrench": Wrench,
    "tire": Disc,
    "timer": Timer,
    "layers": Layers,
    "settings": Settings,
    "search": Search,
    "clock": Clock,
};

export default async function ServicesPage() {
    const t = await getTranslations('Services');
    const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });

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

                {/* Services Grid */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {services.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-xl text-muted-foreground">No services are currently listed. Please contact us for inquiries.</p>
                                </div>
                            ) : (
                                services.map((service) => {
                                    const IconComponent = (service.icon && IconMap[service.icon.toLowerCase()]) || Settings;

                                    return (
                                        <div
                                            key={service.id}
                                            className="p-6 rounded-lg border border-muted hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                                        >
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                                <IconComponent size={32} />
                                            </div>
                                            <h2 className="text-xl font-bold mb-3">{service.name}</h2>
                                            <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                                            <div className="flex items-center text-sm font-medium text-muted-foreground mt-4 pt-4 border-t border-muted/50">
                                                {service.price && (
                                                    <span className="flex items-center mr-6 text-primary">
                                                        <Euro size={16} className="mr-1.5" />
                                                        {t('from')} €{service.price}
                                                    </span>
                                                )}
                                                {service.duration && (
                                                    <span className="flex items-center">
                                                        <Clock size={16} className="mr-1.5" />
                                                        {service.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                href={`/contact?service=${encodeURIComponent(service.name)}`}
                                                className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                {t('bookNow')}
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">{t('contactText')}</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            {t('contactDescription')}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            {t('contactButton')}
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
