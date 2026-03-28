import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/routing";

const sizes = [
    "205/55R16",
    "185/65R15",
    "195/65R15",
    "195/55R16",
    "225/45R17",
    "205/60R16",
    "215/65R16",
    "255/40R18",
    "175/65R14",
    "185/60R15",
    "215/60R17",
    "215/55R17",
    "225/50R17",
    "225/55R17",
];

export default async function TopSizes() {
    const t = await getTranslations("Home");

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">{t("topSizesTitle")}</h2>
                    <p className="text-muted-foreground mt-2">{t("topSizesSubtitle")}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {sizes.map((size) => {
                        // Parse "205/55R16" into parts
                        const match = size.match(/^(\d+)\/(\d+)\s*[R]?(\d+)$/i);
                        let href = `/tires?search=${encodeURI(size)}`;
                        
                        if (match) {
                            const [_, width, ratio, rim] = match;
                            // Include both the 'search' text (to match full size string in DB)
                            // AND the individual dimensions (to populate the form and match structured data)
                            href = `/tires?search=${encodeURI(size)}&width=${width}&aspectRatio=${ratio}&rimSize=${rim}`;
                        }

                        return (
                            <Link
                                key={size}
                                href={href}
                                className="group relative px-5 py-3 rounded-lg border border-border bg-background text-foreground font-semibold text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                            >
                            <span className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                {size}
                            </span>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
