'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

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
    
    // Split existing tracking string into array of strings
    const initialLinks = currentTrackingNumber
        ? currentTrackingNumber.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)
        : [];
    // Ensure there's at least one empty input if there are no links
    const [trackingLinks, setTrackingLinks] = useState<string[]>(initialLinks.length > 0 ? initialLinks : ['']);
    const [notifyCustomer, setNotifyCustomer] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Filter out empty links and join them by newline
            const finalTrackingNumber = trackingLinks.filter(link => link.trim() !== '').join('\n');

            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status, 
                    trackingNumber: finalTrackingNumber,
                    notifyCustomer 
                }),
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

    const addTrackingLink = () => {
        setTrackingLinks([...trackingLinks, '']);
    };

    const removeTrackingLink = (index: number) => {
        if (trackingLinks.length === 1) {
            setTrackingLinks(['']);
            return;
        }
        setTrackingLinks(trackingLinks.filter((_, i) => i !== index));
    };

    const updateTrackingLink = (index: number, value: string) => {
        const newLinks = [...trackingLinks];
        newLinks[index] = value;
        setTrackingLinks(newLinks);
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
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium">Tracking Links</label>
                    <button
                        type="button"
                        onClick={addTrackingLink}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Link
                    </button>
                </div>
                
                <div className="space-y-2">
                    {trackingLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => updateTrackingLink(index, e.target.value)}
                                placeholder="Enter tracking number or URL"
                                className="flex-1 px-3 py-2 rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={() => removeTrackingLink(index)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Remove Link"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 py-2">
                <input
                    type="checkbox"
                    id="notifyCustomer"
                    checked={notifyCustomer}
                    onChange={(e) => setNotifyCustomer(e.target.checked)}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary/20"
                />
                <label htmlFor="notifyCustomer" className="text-sm font-medium cursor-pointer">
                    Send email notification to customer
                </label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
            >
                {isLoading ? 'Updating...' : 'Update Order'}
            </button>
        </form>
    );
}
