"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplyForm({ contactId, contactEmail }: { contactId: string, contactEmail: string }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);

        try {
            const res = await fetch(`/api/admin/contacts/${contactId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) throw new Error("Failed to send reply");

            setSent(true);
            router.refresh(); // Refresh to update status on the page
        } catch (error) {
            console.error(error);
            alert("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                <p className="font-bold">Reply Sent!</p>
                <p className="text-sm mt-1">Your response has been emailed to {contactEmail}.</p>
                <div className="mt-4 bg-white p-3 rounded border border-green-100 text-sm text-gray-600 italic">
                    {message}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background border border-muted rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Reply to Customer</h3>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-md border border-muted min-h-[150px] mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Type your reply here..."
            />
            <div className="flex justify-end">
                <button
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                    {sending ? "Sending..." : "Send Reply"}
                </button>
            </div>
        </div>
    );
}
