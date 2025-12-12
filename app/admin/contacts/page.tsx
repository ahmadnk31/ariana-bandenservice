import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ContactsDataTable, ContactRow } from "./contacts-data-table";

export default async function ContactsPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
    });

    const contactsData: ContactRow[] = contacts.map((contact) => ({
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        service: contact.service || "",
        status: contact.status,
        createdAt: contact.createdAt,
        message: contact.message
    }));

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>
            <div className="bg-background rounded-lg border border-muted p-4">
                <ContactsDataTable data={contactsData} />
            </div>
        </div>
    );
}
