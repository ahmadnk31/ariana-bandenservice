"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AppointmentFormProps {
    tireId?: string | null;
    tireName?: string | null;
}

export default function AppointmentForm({ tireId, tireName }: AppointmentFormProps) {
    const t = useTranslations('Appointment');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [slots, setSlots] = useState<string[]>([]);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        time: "",
        notes: "",
    });

    useEffect(() => {
        if (!selectedDate) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setFetchingSlots(true);
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                const res = await fetch(`/api/appointments/available-slots?date=${formattedDate}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data.slots || []);
                }
            } catch (err) {
                console.error("Failed to fetch slots", err);
            } finally {
                setFetchingSlots(false);
            }
        };

        fetchSlots();
        setFormData(prev => ({ ...prev, time: "" })); // Reset time when date changes
    }, [selectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedDate || !formData.time) {
            setError("Please select both a date and a time slot.");
            return;
        }

        setLoading(true);
        setError("");
        
        // Combine date and time
        const slotDate = new Date(formData.time);

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    tireId,
                    tireName,
                    date: slotDate.toISOString(),
                    notes: formData.notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to book appointment");
            }

            setSuccess(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                time: "",
                notes: "",
            });
            setSelectedDate(undefined);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-8 rounded-lg border border-green-500/50 bg-green-500/10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mx-auto mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 className="text-xl font-bold mb-2">{t('success')}</h3>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {tireName && (
                <div className="p-4 bg-muted/50 border border-muted rounded-md mb-6">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Selected Tire</p>
                    <p className="font-medium text-lg">{tireName}</p>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>
            
            <hr className="border-muted my-6" />

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-2">{t('date')} *</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal h-12 px-4 rounded-md border-muted",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Select a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-2">{t('time')} *</label>
                    <select
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        disabled={!selectedDate || fetchingSlots || slots.length === 0}
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    >
                        <option value="">
                            {!selectedDate ? t('selectDateFirst') : fetchingSlots ? "Loading..." : slots.length === 0 ? t('noSlots') : "Select time"}
                        </option>
                        {slots.map((slot) => {
                            const dateObj = new Date(slot);
                            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <option key={slot} value={slot}>
                                    {timeString}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">{t('notes')}</label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
            </div>

            {error && (
                <p className="text-sm text-red-500 p-3 bg-red-500/10 rounded-md border border-red-500/20">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading || !selectedDate || !formData.time}
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold uppercase tracking-wider shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? "Processing..." : t('book')}
            </button>
        </form>
    );
}
