import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { prisma } from "@/lib/db";
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { getAlternateLanguages } from "@/lib/utils";
import { Link } from "@/src/i18n/routing";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, rimSize: string }> }): Promise<Metadata> {
    const { locale, rimSize } = await params;
    const t = await getTranslations({ locale, namespace: 'Tires' });
    const metadata = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: `${t('secondHand')} ${rimSize}" | ${metadata('title').split('|')[0].trim() || 'Gent Bandenservice'}`,
        description: `Bekijk ons assortiment tweedehands banden in maat ${rimSize} inch.`,
        alternates: {
            canonical: `/${locale}/secondhand-tires/${rimSize}`,
            languages: getAlternateLanguages(`/secondhand-tires/${rimSize}`),
        },
    };
}

// Common static sizes fallback
const commonSizes: Record<number, string[]> = {
    13: [
        "145/70 R13", "155/65 R13", "155/70 R13", "155/80 R13", "165/65 R13",
        "165/70 R13", "165/80 R13", "175/60 R13", "175/70 R13", "185/60 R13",
        "205/60 R13"
    ],
    14: [
        "155/65 R14", "165/60 R14", "165/65 R14", "165/70 R14", "175/65 R14",
        "175/70 R14", "185/55 R14", "185/60 R14", "185/65 R14", "185/70 R14",
        "195/60 R14", "195/70 R14", "205/70 R14"
    ],
    15: [
        "145/65 R15", "155/60 R15", "165/60 R15", "165/65 R15", "175/55 R15",
        "175/60 R15", "175/65 R15", "185/55 R15", "185/60 R15", "185/65 R15",
        "195/45 R15", "195/50 R15", "195/55 R15", "195/60 R15", "195/65 R15",
        "205/50 R15", "205/55 R15", "205/60 R15", "205/65 R15", "205/70 R15",
        "215/60 R15", "215/65 R15", "215/70 R15", "225/60 R15", "225/70 R15",
        "235/75 R15"
    ],
    16: [
        "185/55 R16", "195/45 R16", "195/50 R16", "195/55 R16", "195/60 R16",
        "205/45 R16", "205/50 R16", "205/55 R16", "205/60 R16", "205/65 R16",
        "215/45 R16", "215/55 R16", "215/60 R16", "215/65 R16", "215/70 R16",
        "225/50 R16", "225/55 R16", "225/60 R16", "225/65 R16", "225/70 R16",
        "235/60 R16", "235/65 R16", "235/70 R16", "245/70 R16", "265/70 R16"
    ],
    17: [
        "205/40 R17", "205/45 R17", "205/50 R17", "205/55 R17", "215/40 R17",
        "215/45 R17", "215/50 R17", "215/55 R17", "215/60 R17", "215/65 R17",
        "225/45 R17", "225/50 R17", "225/55 R17", "225/60 R17", "225/65 R17",
        "235/45 R17", "235/50 R17", "235/55 R17", "235/60 R17", "235/65 R17",
        "245/45 R17", "245/65 R17", "255/40 R17", "255/60 R17", "265/65 R17",
        "265/70 R17"
    ],
    18: [
        "215/40 R18", "215/45 R18", "215/50 R18", "215/55 R18", "225/40 R18",
        "225/45 R18", "225/50 R18", "225/55 R18", "225/60 R18", "235/40 R18",
        "235/45 R18", "235/50 R18", "235/55 R18", "235/60 R18", "235/65 R18",
        "245/35 R18", "245/40 R18", "245/45 R18", "245/50 R18", "245/60 R18",
        "255/35 R18", "255/40 R18", "255/45 R18", "255/55 R18", "255/60 R18",
        "265/35 R18", "265/60 R18", "275/35 R18", "275/40 R18", "285/35 R18"
    ],
    19: [
        "225/35 R19", "225/40 R19", "225/45 R19", "225/55 R19", "235/35 R19",
        "235/40 R19", "235/45 R19", "235/50 R19", "235/55 R19", "245/35 R19",
        "245/40 R19", "245/45 R19", "245/50 R19", "255/30 R19", "255/35 R19",
        "255/40 R19", "255/45 R19", "255/50 R19", "255/55 R19", "265/30 R19",
        "265/35 R19", "265/50 R19", "275/30 R19", "275/35 R19", "275/40 R19",
        "285/30 R19", "285/35 R19", "285/45 R19", "295/30 R19", "295/35 R19"
    ],
    20: [
        "235/35 R20", "235/45 R20", "235/50 R20", "235/55 R20", "245/30 R20",
        "245/35 R20", "245/40 R20", "245/45 R20", "245/50 R20", "255/30 R20",
        "255/35 R20", "255/40 R20", "255/45 R20", "255/50 R20", "255/55 R20",
        "265/30 R20", "265/35 R20", "265/40 R20", "265/45 R20", "265/50 R20",
        "275/30 R20", "275/35 R20", "275/40 R20", "275/45 R20", "275/50 R20",
        "285/30 R20", "285/35 R20", "285/40 R20", "295/30 R20", "295/35 R20",
        "295/40 R20", "305/30 R20", "315/35 R20"
    ],
    21: [
        "245/35 R21", "245/40 R21", "255/30 R21", "255/35 R21", "255/40 R21",
        "255/45 R21", "265/30 R21", "265/35 R21", "265/40 R21", "265/45 R21",
        "275/30 R21", "275/35 R21", "275/40 R21", "275/45 R21", "285/30 R21",
        "285/35 R21", "285/40 R21", "295/30 R21", "295/35 R21", "295/40 R21",
        "305/30 R21", "315/30 R21", "315/35 R21", "325/30 R21"
    ],
    22: [
        "255/30 R22", "255/35 R22", "265/30 R22", "265/35 R22", "265/40 R22",
        "275/35 R22", "275/40 R22", "285/30 R22", "285/35 R22", "285/40 R22",
        "285/45 R22", "295/25 R22", "295/30 R22", "295/35 R22", "295/40 R22",
        "305/25 R22", "305/30 R22", "305/40 R22", "315/25 R22", "315/30 R22",
        "315/35 R22", "325/35 R22"
    ],
    23: [
        "275/35 R23", "285/35 R23", "295/30 R23", "295/35 R23", "305/30 R23",
        "305/35 R23", "315/25 R23", "315/30 R23", "325/30 R23"
    ],
    24: [
        "255/30 R24", "275/25 R24", "275/30 R24", "285/30 R24", "295/25 R24",
        "295/30 R24", "295/35 R24", "305/30 R24", "305/35 R24", "315/30 R24"
    ]
};

export default async function SecondhandRimSizePage({ params }: { params: Promise<{ locale: string, rimSize: string }> }) {
    const { locale, rimSize } = await params;
    const t = await getTranslations({ locale, namespace: 'Tires' });

    const parsedRimSize = parseInt(rimSize, 10);

    if (isNaN(parsedRimSize)) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-muted-foreground">Invalid size</p>
                </main>
                <Footer />
            </div>
        );
    }

    // Get sizes from DB for this rim size
    const dbSizesQuery = await prisma.tire.findMany({
        where: { rimSize: parsedRimSize },
        select: { size: true },
        distinct: ['size']
    });

    const dbSizes = dbSizesQuery.map(t => t.size);
    const fallbackSizes = commonSizes[parsedRimSize] || [];

    // Combine and deduplicate
    const allSizes = Array.from(new Set([...dbSizes, ...fallbackSizes]))
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-8 max-w-4xl mx-auto">
                        <Link href="/secondhand-tires" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            {t('backToTires')}
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 mb-8">
                            <div>
                                <div className="inline-flex items-center justify-center px-3 py-1 mb-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
                                    {t('secondHand')}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                    {rimSize}" {t('size')}
                                </h1>
                            </div>
                            <p className="text-muted-foreground font-medium bg-muted/50 px-4 py-2 rounded-lg">
                                {allSizes.length} {t('foundResults', { count: '' }).replace(/[0-9]/g, '').trim()}
                            </p>
                        </div>
                    </div>

                    {allSizes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {allSizes.map((sizeStr) => (
                                <div key={sizeStr} className="group bg-card border-2 border-muted rounded-2xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                                    <div className="w-full flex items-center justify-center h-20 mb-4 bg-muted/30 rounded-xl group-hover:bg-primary/5 transition-colors">
                                        <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            {sizeStr}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 font-medium">
                                        {t('secondHand')} Banden - {sizeStr}
                                    </p>
                                    <Link
                                        href={{ pathname: '/appointment', query: { tireName: `Tweedehands ${sizeStr}` } }}
                                        className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-sm transition-colors bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {t('makeAppointment')}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border mt-8 max-w-4xl mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t('noResults')}</h3>
                            <Link href="/secondhand-tires" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 mt-4">
                                Bekijk andere maten
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
