import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminShell from "../components/AdminShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAuthenticated();

    // Check if we're on the login page (simple check based on path not possible in layout w/o headers, 
    // but auth check handles redirection anyway if protected)

    // We only render the shell if authenticated, otherwise we assume it's login or public 
    // actually layout wraps login too... 
    // If unauthenticated, we probably shouldn't show the shell?
    // But the previous code didn't show sidebar if !authenticated.

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

