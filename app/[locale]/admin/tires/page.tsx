import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { TiresDataTable, TireRow } from "./tires-data-table";

export default async function TiresPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    const tires = await prisma.tire.findMany({
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
    });

    // Transform to match TireRow interface
    const tiresData: TireRow[] = tires.map((tire) => ({
        id: tire.id,
        name: tire.name,
        brand: tire.brand,
        season: tire.season,
        condition: tire.condition, // Add
        size: tire.size,
        loadIndex: tire.loadIndex,
        speedRating: tire.speedRating,
        price: tire.price,
        stock: tire.stock,
        inStock: tire.inStock,
        images: tire.images,
    }));

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Tires</h1>
                <Link
                    href="/admin/tires/new"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Tire
                </Link>
            </div>

            <div className="bg-background rounded-lg border border-muted p-4">
                <TiresDataTable data={tiresData} />
            </div>
        </div>
    );
}


