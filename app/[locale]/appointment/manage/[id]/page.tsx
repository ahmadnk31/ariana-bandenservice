import { Metadata } from "next";
import { getAlternateLanguages } from "@/lib/utils";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import ManageAppointmentClient from "../../../../components/ManageAppointmentClient";
import { getTranslations } from 'next-intl/server';
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
    const { locale, id } = await params;
    
    return {
        title: "Manage Appointment",
        description: "Review, reschedule, or cancel your appointment.",
        alternates: {
            canonical: `/${locale}/appointment/manage/${id}`,
            languages: getAlternateLanguages(`/appointment/manage/${id}`),
        },
    };
}

export default async function ManageAppointmentPage({
    params,
}: {
    params: Promise<{ locale: string, id: string }>;
}) {
    const { id } = await params;
    const t = await getTranslations('Appointment');

    const appointment = await prisma.appointment.findUnique({
        where: { id }
    });

    if (!appointment) {
        notFound();
    }

    // Pass safe serializable object to client
    const safeAppointment = {
        id: appointment.id,
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        tireName: appointment.tireName,
        date: appointment.date,
        status: appointment.status
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4 max-w-2xl">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                                {t('manageTitle') || "Manage Appointment"}
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {t('manageSubtitle') || "Review your booking details, reschedule your time, or cancel your appointment."}
                            </p>
                        </div>

                        <div className="bg-card shadow-lg border border-border rounded-xl p-6 md:p-8">
                            <ManageAppointmentClient appointment={safeAppointment} />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
