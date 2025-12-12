import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Wrench, Disc, Timer, Layers, Settings, Search, Clock, Euro } from "lucide-react";

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
                            Our <span className="text-primary">Services</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Professional tire services by certified technicians. Quality workmanship and fast turnaround times.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                            className="p-8 rounded-lg border border-muted hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
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
                                                        From €{service.price}
                                                    </span>
                                                )}
                                                {service.duration && (
                                                    <span className="flex items-center">
                                                        <Clock size={16} className="mr-1.5" />
                                                        {service.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={`/contact?service=${encodeURIComponent(service.name)}`}
                                                className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                Book Now
                                            </a>
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
                        <h2 className="text-3xl font-bold mb-4">Ready to book a service?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Contact us today to schedule an appointment or get a quote for your tire needs.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            Contact Us
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
