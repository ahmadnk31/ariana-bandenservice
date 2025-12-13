'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderStatusFormProps {
    orderId: string;
    currentStatus: string;
    currentTrackingNumber: string;
}

const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function OrderStatusForm({
    orderId,
    currentStatus,
    currentTrackingNumber,
}: OrderStatusFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, trackingNumber }),
            });

            if (!res.ok) throw new Error('Failed to update order');

            router.refresh();
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5">Tracking Number</label>
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Updating...' : 'Update Order'}
            </button>
        </form>
    );
}
