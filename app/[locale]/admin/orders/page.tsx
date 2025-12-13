import { prisma } from "@/lib/db";
import Link from "next/link";
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    paid: { label: "Paid", color: "bg-blue-100 text-blue-800", icon: Package },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            items: {
                include: {
                    tire: true,
                },
            },
            shippingAddress: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        Manage customer orders and shipments
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                    const count = orders.filter(o => o.status === status).length;
                    const Icon = config.icon;
                    return (
                        <div key={status} className="bg-background rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{config.label}</span>
                            </div>
                            <p className="text-2xl font-bold">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="bg-background rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-medium text-sm">Order</th>
                                <th className="text-left p-4 font-medium text-sm">Customer</th>
                                <th className="text-left p-4 font-medium text-sm">Items</th>
                                <th className="text-left p-4 font-medium text-sm">Total</th>
                                <th className="text-left p-4 font-medium text-sm">Shipping</th>
                                <th className="text-left p-4 font-medium text-sm">Status</th>
                                <th className="text-left p-4 font-medium text-sm">Date</th>
                                <th className="text-left p-4 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const config = statusConfig[order.status] || statusConfig.pending;
                                    const Icon = config.icon;
                                    return (
                                        <tr key={order.id} className="hover:bg-muted/30">
                                            <td className="p-4">
                                                <p className="font-mono font-medium">{order.orderNumber}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{order.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm">{order.items.length} item(s)</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium">€{order.total.toFixed(2)}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm uppercase">{order.shippingCarrier}</p>
                                                <p className="text-xs text-muted-foreground">{order.shippingMethod}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
