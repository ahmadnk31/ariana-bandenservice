import { prisma } from "@/lib/db";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { OrdersDataTable, OrderRow } from "./orders-data-table";

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

    // Transform data for the table
    const ordersData: OrderRow[] = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Guest',
        email: order.email,
        itemsCount: order.items.length,
        total: order.total,
        shippingCarrier: order.shippingCarrier,
        shippingMethod: order.shippingMethod,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
    }));

    return (
        <div className="p-8 space-y-6">
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
            <div className="bg-background rounded-xl border overflow-hidden p-1">
                <OrdersDataTable data={ordersData} />
            </div>
        </div>
    );
}
