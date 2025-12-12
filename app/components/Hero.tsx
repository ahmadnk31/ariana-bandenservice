export default function Hero() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden bg-muted">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Keep Rolling with <span className="text-primary">Safety</span> & Style
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Expert tire fitting, balancing, and repair services. We stock top brands to ensure your journey is smooth and safe.
                    </p>
                    <div className="flex gap-4">
                        <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            Book Appointment
                        </a>
                        <a href="/tires" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            Browse Tires
                        </a>
                    </div>
                </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -z-10 h-full w-1/3 bg-gradient-to-l from-muted-foreground/10 to-transparent skew-x-12 translate-x-20"></div>
        </section>
    );
}
