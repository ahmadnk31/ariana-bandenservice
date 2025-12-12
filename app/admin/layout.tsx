import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminShell from "../components/AdminShell";
import { Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

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
        <html lang="en">
            <body className={`${outfit.variable} antialiased font-sans`}>
                <div className="min-h-screen bg-muted/30">
                    {authenticated ? (
                        <AdminShell>{children}</AdminShell>
                    ) : (
                        <main className="min-h-screen flex items-center justify-center">
                            {children}
                        </main>
                    )}
                </div>
            </body>
        </html>
    );
}

