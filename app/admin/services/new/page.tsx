import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ServiceForm from "../ServiceForm";

export default async function NewServicePage() {
    const authenticated = await isAuthenticated();
    if (!authenticated) redirect("/admin/login");

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Add New Service</h1>
            <div className="bg-background border border-muted rounded-lg p-6">
                <ServiceForm />
            </div>
        </div>
    );
}
