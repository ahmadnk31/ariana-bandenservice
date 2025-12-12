import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    const tireCount = await prisma.tire.count();
    const recentTires = await prisma.tire.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1 } },
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-background rounded-lg border border-muted p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Tires</p>
                            <p className="text-3xl font-bold">{tireCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background rounded-lg border border-muted p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-lg font-bold text-green-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background rounded-lg border border-muted p-6">
                    <Link href="/admin/tires/new" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Quick Action</p>
                            <p className="text-lg font-bold">Add New Tire</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Tires */}
            <div className="bg-background rounded-lg border border-muted">
                <div className="p-4 border-b border-muted flex items-center justify-between">
                    <h2 className="font-bold">Recent Tires</h2>
                    <Link href="/admin/tires" className="text-sm text-primary hover:underline">
                        View all
                    </Link>
                </div>
                <div className="divide-y divide-muted">
                    {recentTires.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No tires yet.{" "}
                            <Link href="/admin/tires/new" className="text-primary hover:underline">
                                Add your first tire
                            </Link>
                        </div>
                    ) : (
                        recentTires.map((tire) => (
                            <Link
                                key={tire.id}
                                href={`/admin/tires/${tire.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                    {tire.images[0] ? (
                                        <img
                                            src={tire.images[0].url}
                                            alt={tire.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{tire.name}</p>
                                    <p className="text-sm text-muted-foreground">{tire.brand} · {tire.size}</p>
                                </div>
                                <p className="font-bold">€{tire.price}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
