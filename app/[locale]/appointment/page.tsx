import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AppointmentForm from "../../components/AppointmentForm";
import { getTranslations } from 'next-intl/server';
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    
    const title = "Maak een Afspraak | Gent Bandenservice";
    const description = "Plan eenvoudig je bandenwissel of service bij Gent Bandenservice. Kies je banden en reserveer direct een vrij tijdslot.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `/${locale}/appointment`,
            siteName: "Gent Bandenservice",
            type: "website",
            images: [{ url: "/gentbandenservice/android-chrome-512x512.png", width: 512, height: 512, alt: "Gent Bandenservice Logo" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/gentbandenservice/android-chrome-512x512.png"],
        },
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
    const { tireId, tireName: urlTireName } = await searchParams;
    const t = await getTranslations('Appointment');

    let displayTireName = urlTireName;

    // Security Hardening: Fetch tire name from DB if ID is provided
    // This prevents "Link Manipulation" where an attacker could put fake names in the URL.
    if (tireId) {
        const tire = await prisma.tire.findUnique({
            where: { id: tireId },
            select: { name: true, brand: true }
        });
        if (tire) {
            displayTireName = `${tire.brand} ${tire.name}`;
        }
    }

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
                            <AppointmentForm tireId={tireId} tireName={displayTireName} />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

