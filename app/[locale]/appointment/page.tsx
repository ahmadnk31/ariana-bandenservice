import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AppointmentForm from "../../components/AppointmentForm";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    
    return {
        title: "Book an Appointment",
        description: "Book an appointment with Gent bandenservice. Select a tire and pick an available timeslot.",
        alternates: {
            canonical: `/${locale}/appointment`,
            languages: getAlternateLanguages('/appointment'),
        },
    };
}

export default async function AppointmentPage({
    searchParams,
}: {
    searchParams: Promise<{ tireId?: string, tireName?: string }>;
}) {
    const { tireId, tireName } = await searchParams;
    const t = await getTranslations('Appointment');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="bg-card shadow-sm border border-border rounded-xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">{t('formTitle')}</h2>
                            <AppointmentForm tireId={tireId} tireName={tireName} />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

