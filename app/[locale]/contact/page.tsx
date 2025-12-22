import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const metadata = messages.Metadata || {};

    return {
        title: metadata.contactTitle || "Contact | Ariana Bandenservice",
        description: metadata.contactDescription || "Get in touch with Ariana Bandenservice. Book an appointment or request a quote for tire services.",
        alternates: {
            canonical: `/${locale}/contact`,
            languages: getAlternateLanguages('/contact'),
        },
    };
}

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ service?: string }>;
}) {
    const { service } = await searchParams;
    const t = await getTranslations('Contact');

    const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
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

                {/* Contact Content */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('formTitle')}</h2>
                                <ContactForm services={services} initialService={service} />
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">
                                    {t('visitUs')}
                                </h2>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1">{t('address')}</h3>
                                            <p className="text-muted-foreground">
                                                {t('addressText')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1">{t('phone')}</h3>
                                            <p className="text-muted-foreground">
                                                <a href="tel:+32466195622" className="hover:text-primary transition-colors">
                                                    +32 466 195 622
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1">E-mail</h3>
                                            <p className="text-muted-foreground">
                                                <a href="mailto:info@arianabandenservice.be" className="hover:text-primary transition-colors">
                                                    info@arianabandenservice.be
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1">{t('openingHours')}</h3>
                                            <ul className="text-muted-foreground space-y-1">
                                                <li>{t('openingHoursText')}</li>
                                                <li>{t('openingHoursText2')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
