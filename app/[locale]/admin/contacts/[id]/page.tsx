import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import ReplyForm from "./ReplyForm";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const authenticated = await isAuthenticated();
    if (!authenticated) redirect("/admin/login");

    const { id } = await params;
    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) return notFound();

    // Mark as read if unread
    if (contact.status === "unread") {
        await prisma.contact.update({
            where: { id },
            data: { status: "read" },
        });
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/contacts" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back to Messages
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Message from {contact.firstName} {contact.lastName}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize 
                        ${contact.status === 'replied' ? 'bg-green-100 text-green-700' :
                            contact.status === 'read' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                        {contact.status}
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Contact Info */}
                <div className="bg-background border border-muted rounded-lg p-6 grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</label>
                        <p>{contact.email}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
                        <p>{contact.phone || "N/A"}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service</label>
                        <p>{contact.service || "General Inquiry"}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                        <p>{contact.createdAt.toLocaleString()}</p>
                    </div>
                </div>

                {/* Message Body */}
                <div className="bg-background border border-muted rounded-lg p-6">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                    <div className="whitespace-pre-wrap text-lg leading-relaxed">
                        {contact.message}
                    </div>
                </div>

                {/* Reply Section */}
                {contact.status === "replied" ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="font-bold text-green-800 mb-2">Replied on {contact.updatedAt.toLocaleDateString()}</h3>
                        {contact.replyMessage && (
                            <div className="bg-white p-4 rounded border border-green-100 text-gray-600 italic">
                                {contact.replyMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    <ReplyForm contactId={contact.id} contactEmail={contact.email} />
                )}
            </div>
        </div>
    );
}
