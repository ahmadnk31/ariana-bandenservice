import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ServiceForm from "../ServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const authenticated = await isAuthenticated();
    if (!authenticated) redirect("/admin/login");

    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) return notFound();

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Edit Service</h1>
            <div className="bg-background border border-muted rounded-lg p-6">
                <ServiceForm
                    isEdit
                    initialData={{
                        id: service.id,
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        duration: service.duration || "",
                        icon: service.icon || "",
                        active: service.active,
                    }}
                />
            </div>
        </div>
    );
}
