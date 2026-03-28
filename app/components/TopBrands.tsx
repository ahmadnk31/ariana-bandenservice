import Image from "next/image";
import { getTranslations } from "next-intl/server";

const brands = [
    { src: "/michelin.png", alt: "Michelin" },
    { src: "/continental.png", alt: "Continental" },
    { src: "/bridgestone.png", alt: "Bridgestone" },
    { src: "/pirelli.png", alt: "Pirelli" },
    { src: "/dunlop.png", alt: "Dunlop" },
    { src: "/hankook.png", alt: "Hankook" },
    { src: "/kumho.png", alt: "Kumho" },
    { src: "/toyo.png", alt: "Toyo" },
    { src: "/nexen.png", alt: "Nexen" },
    { src: "/kleber.png", alt: "Kleber" },
    { src: "/goodride.png", alt: "Goodride" },
    { src: "/nankang.png", alt: "Nankang" },
    { src: "/tracmax.png", alt: "Tracmax" },
    { src: "/rotalla.png", alt: "Rotalla" },
    { src: "/ceat.png", alt: "CEAT" },
    { src: "/minerva.png", alt: "Minerva" },
    { src: "/Leao.png", alt: "Leao" },
];

export default async function TopBrands() {
    const t = await getTranslations("Home");

    return (
        <section className="py-16 bg-background overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight">{t("topBrandsTitle")}</h2>
                <p className="text-muted-foreground mt-2">{t("topBrandsSubtitle")}</p>
            </div>

            {/* Marquee container */}
            <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                {/* Scrolling track */}
                <div className="flex animate-marquee hover:[animation-play-state:paused]">
                    {/* Duplicate brands for seamless loop */}
                    {[...brands, ...brands].map((brand, idx) => (
                        <div
                            key={`${brand.alt}-${idx}`}
                            className="flex-shrink-0 mx-6 flex items-center justify-center h-20 w-36 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        >
                            <Image
                                src={brand.src}
                                alt={brand.alt}
                                width={140}
                                height={70}
                                className="object-contain max-h-14 w-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
