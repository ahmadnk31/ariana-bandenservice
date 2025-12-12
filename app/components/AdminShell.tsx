"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:hidden">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mr-4 p-2 text-muted-foreground hover:bg-muted rounded-md"
                    aria-label="Toggle sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div className="font-bold text-lg">Admin Panel</div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    <div className="hidden border-b border-muted p-4 md:block h-16 flex items-center">
                        <Link href="/admin" className="text-lg font-bold">
                            Admin Panel
                        </Link>
                    </div>
                    {/* Mobile Close Button */}
                    <div className="flex md:hidden justify-between items-center p-4 border-b border-muted">
                        <span className="font-bold">Menu</span>
                        <button onClick={() => setSidebarOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <Link
                            href="/admin"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/tires"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                            Tires
                        </Link>
                        <Link
                            href="/admin/contacts"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Messages
                        </Link>
                        <Link
                            href="/admin/services"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                            Services
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View Site
                        </Link>
                    </nav>
                    <div className="border-t border-muted p-4">
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="md:ml-64 min-h-[calc(100vh-4rem)] md:min-h-screen transition-all duration-200">
                {children}
            </main>
        </div>
    );
}
