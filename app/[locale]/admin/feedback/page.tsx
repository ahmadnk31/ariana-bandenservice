import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FeedbackDataTable, FeedbackRow } from "./feedback-data-table";

export default async function FeedbackAdminPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    const feedbacks = await prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
    });

    const feedbackData: FeedbackRow[] = feedbacks.map((f) => ({
        id: f.id,
        happiness: f.happiness,
        feedback: f.feedback,
        createdAt: f.createdAt,
    }));

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Customer Feedback</h1>
            <div className="bg-background rounded-lg border border-muted p-4">
                <FeedbackDataTable data={feedbackData} />
            </div>
        </div>
    );
}
