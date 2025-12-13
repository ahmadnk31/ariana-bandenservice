import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, User, MapPin, CreditCard } from "lucide-react";
import OrderStatusForm from "./OrderStatusForm";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    tire: {
                        include: {
                            images: {
                                take: 1,
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
            },
            shippingAddress: true,
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/orders"
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                    <p className="text-muted-foreground">
                        Created {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-background rounded-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Order Items</h2>
                        </div>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                        {item.tire.images[0] && (
                                            <img
                                                src={item.tire.images[0].url}
                                                alt={item.tire.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{item.tire.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.tire.brand} • {item.tire.size}
                                        </p>
                                        <p className="text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-background rounded-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Shipping Address</h2>
                        </div>
                        {order.shippingAddress ? (
                            <div className="text-sm">
                                <p className="font-medium">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No address provided</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-background rounded-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Order Status</h2>
                        </div>
                        <OrderStatusForm
                            orderId={order.id}
                            currentStatus={order.status}
                            currentTrackingNumber={order.trackingNumber || ""}
                        />
                    </div>

                    {/* Customer Info */}
                    <div className="bg-background rounded-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Customer</h2>
                        </div>
                        <div className="text-sm space-y-2">
                            <p>
                                <span className="text-muted-foreground">Email:</span>{" "}
                                <a href={`mailto:${order.email}`} className="text-primary hover:underline">
                                    {order.email}
                                </a>
                            </p>
                            {order.phone && (
                                <p>
                                    <span className="text-muted-foreground">Phone:</span>{" "}
                                    <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                                        {order.phone}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-background rounded-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Payment</h2>
                        </div>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>€{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Shipping ({order.shippingCarrier?.toUpperCase()} {order.shippingMethod})
                                </span>
                                <span>€{order.shippingCost.toFixed(2)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>€{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
