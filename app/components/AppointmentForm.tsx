"use client";
import { Star } from "lucide-react";

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
                
                {/* Google Review CTA */}
                <div className="mt-8 p-6 rounded-2xl border-2 border-primary/20 bg-card shadow-sm relative overflow-hidden group text-left">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="w-12 h-12 fill-primary text-primary rotate-12" />
                    </div>
                    <h4 className="text-base font-bold mb-2 relative z-10 text-foreground">
                        {useTranslations('Home')('reviews.successCTA')}
                    </h4>
                    <a 
                        href="https://search.google.com/local/writereview?placeid=ChIJ-UDmcgB3w0cR779LDsBERhc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#F59E0B] text-white font-bold hover:bg-[#D97706] transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5l3.09 6.26L22 8.74l-5 4.87 1.18 6.88L12 17.25l-6.18 3.24L7 13.61l-5-4.87 6.91-0.98L12 1.5z"/></svg>
                        {useTranslations('Home')('reviews.reviewUs')}
                    </a>
                </div>
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

            <div className="relative flex items-center py-1">
                <div className="flex-1 border-t border-muted"></div>
                <span className="mx-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">of</span>
                <div className="flex-1 border-t border-muted"></div>
            </div>

            <a
                href={`https://wa.me/32467871205?text=${encodeURIComponent(`Hallo, ik wil graag een afspraak maken${tireName ? ` voor: ${tireName}` : ''}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-12 rounded-md inline-flex items-center justify-center gap-2 px-3 bg-[#25D366] text-white font-bold text-sm sm:uppercase sm:tracking-wider shadow transition-colors hover:bg-[#20bd5a]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="shrink-0">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Afspreken via WhatsApp
            </a>
        </form>
    );
}
