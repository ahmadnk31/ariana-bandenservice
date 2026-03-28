import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";

export default async function AdminAppointmentsPage() {
    const t = await getTranslations("Navigation");

    const appointments = await prisma.appointment.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Tire Info</th>
                                <th className="px-6 py-4 font-medium">Date & Time</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No appointments booked yet.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{appointment.firstName} {appointment.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{appointment.email}</div>
                                            <div className="text-muted-foreground">{appointment.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {appointment.tireName ? (
                                                <div className="max-w-[200px] truncate text-primary">{appointment.tireName}</div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{format(new Date(appointment.date), "dd MMM yyyy")}</div>
                                            <div className="text-muted-foreground">{format(new Date(appointment.date), "HH:mm")}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider
                                                ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                                ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px] truncate" title={appointment.notes || ""}>
                                                {appointment.notes || "-"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
