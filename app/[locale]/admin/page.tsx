import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    // Fetch stats in parallel
    const [
        tireCount,
        orderCount,
        pendingAppointmentsCount,
        paidOrders,
        recentTires,
        recentOrders,
        upcomingAppointments,
        recentContacts
    ] = await Promise.all([
        prisma.tire.count(),
        prisma.order.count(),
        prisma.appointment.count({ where: { status: "pending" } }),
        prisma.order.findMany({
            where: { status: { in: ["paid", "shipped", "delivered"] } },
            select: { total: true }
        }),
        prisma.tire.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { images: { take: 1 } },
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        }),
        prisma.appointment.findMany({
            take: 5,
            where: { date: { gte: new Date() } },
            orderBy: { date: "asc" },
        }),
        prisma.contact.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        })
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-background rounded-xl border border-muted p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">€{totalRevenue.toLocaleString()}</p>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        <span>From paid orders</span>
                    </div>
                </div>

                <div className="bg-background rounded-xl border border-muted p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">{orderCount}</p>
                    <Link href="/admin/orders" className="mt-2 text-xs text-primary hover:underline block">View all orders →</Link>
                </div>

                <div className="bg-background rounded-xl border border-muted p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Inventory (Tires)</p>
                    <p className="text-3xl font-bold">{tireCount}</p>
                    <Link href="/admin/tires" className="mt-2 text-xs text-primary hover:underline block">Manage inventory →</Link>
                </div>

                <div className="bg-background rounded-xl border border-muted p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pending Appointments</p>
                    <p className="text-3xl font-bold text-amber-500">{pendingAppointmentsCount}</p>
                    <Link href="/admin/appointments" className="mt-2 text-xs text-primary hover:underline block">View schedule →</Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Orders Table */}
                <div className="bg-background rounded-xl border border-muted overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/30">
                        <h2 className="font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            Recent Orders
                        </h2>
                        <Link href="/admin/orders" className="text-xs text-primary hover:underline">View All</Link>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/20 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Order #</th>
                                    <th className="px-4 py-2 font-medium">Customer</th>
                                    <th className="px-4 py-2 font-medium">Status</th>
                                    <th className="px-4 py-2 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted">
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground italic">No orders yet</td></tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                                            <td className="px-4 py-3">{order.email}</td>
                                            <td className="px-4 py-3 capitalize">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">€{order.total}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-background rounded-xl border border-muted overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/30">
                        <h2 className="font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Upcoming Appointments
                        </h2>
                        <Link href="/admin/appointments" className="text-xs text-primary hover:underline">Full Schedule</Link>
                    </div>
                    <div className="flex-1 divide-y divide-muted">
                        {upcomingAppointments.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground italic font-light italic">No upcoming appointments</div>
                        ) : (
                            upcomingAppointments.map((apt) => (
                                <div key={apt.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{apt.firstName} {apt.lastName}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                {format(apt.date, "dd MMM")}
                                            </span>
                                            <span>{format(apt.date, "HH:mm")}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Messages */}
                <div className="bg-background rounded-xl border border-muted overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/30">
                        <h2 className="font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            Latest Inquiries
                        </h2>
                        <Link href="/admin/contacts" className="text-xs text-primary hover:underline">Inbox</Link>
                    </div>
                    <div className="flex-1 divide-y divide-muted">
                        {recentContacts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground italic font-light italic">No messages yet</div>
                        ) : (
                            recentContacts.map((msg) => (
                                <div key={msg.id} className="p-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-medium text-sm">{msg.firstName} {msg.lastName}</p>
                                        <span className="text-[10px] text-muted-foreground">{format(msg.createdAt, "dd/MM")}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Tires */}
                <div className="bg-background rounded-xl border border-muted overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/30">
                        <h2 className="font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                            Latest Inventory
                        </h2>
                        <Link href="/admin/tires" className="text-xs text-primary hover:underline">Full Inventory</Link>
                    </div>
                    <div className="flex-1 divide-y divide-muted">
                        {recentTires.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground italic font-light italic">No tires in stock</div>
                        ) : (
                            recentTires.map((tire) => (
                                <Link key={tire.id} href={`/admin/tires/${tire.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/10 transition-colors">
                                    <div className="w-10 h-10 bg-muted rounded border border-muted overflow-hidden flex-shrink-0">
                                        {tire.images[0] ? (
                                            <img src={tire.images[0].url} alt={tire.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{tire.name}</p>
                                        <p className="text-xs text-muted-foreground">{tire.brand} · {tire.size}</p>
                                    </div>
                                    <p className="font-bold text-sm">€{tire.price}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
