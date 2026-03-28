import { prisma } from "@/lib/db";
import { AppointmentsDataTable } from "./appointments-data-table";

export default async function AdminAppointmentsPage() {
    const appointments = await prisma.appointment.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            </div>

            <div className="bg-background rounded-xl border border-muted p-4 shadow-sm">
                <AppointmentsDataTable data={appointments} />
            </div>
        </div>
    );
}
