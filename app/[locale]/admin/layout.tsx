import { isAuthenticated } from "@/lib/auth";
import AdminShell from "../../components/AdminShell";

export const metadata = {
    title: "Admin | Ariana Bandenservice",
    description: "Admin Dashboard",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAuthenticated();

    return (
        <div className="min-h-screen bg-muted/30">
            {authenticated ? (
                <AdminShell>{children}</AdminShell>
            ) : (
                <main className="min-h-screen flex items-center justify-center">
                    {children}
                </main>
            )}
        </div>
    );
}

