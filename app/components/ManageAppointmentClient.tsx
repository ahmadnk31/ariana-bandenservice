"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";

interface Appointment {
    id: string;
    firstName: string;
    lastName: string;
    tireName: string | null;
    date: Date;
    status: string;
}

interface Props {
    appointment: Appointment;
}

export default function ManageAppointmentClient({ appointment: initialAppointment }: Props) {
    const t = useTranslations("Appointment");
    const [appointment, setAppointment] = useState(initialAppointment);
    
    // UI States
    const [view, setView] = useState<"overview" | "reschedule">("overview");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    // Reschedule States
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [slots, setSlots] = useState<string[]>([]);
    const [fetchingSlots, setFetchingSlots] = useState(false);

    useEffect(() => {
        if (!selectedDate) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setFetchingSlots(true);
            try {
                const res = await fetch(`/api/appointments/available-slots?date=${selectedDate}`);
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
        setSelectedTime("");
    }, [selectedDate]);

    const handleCancel = async () => {
        if (!confirm(t('confirmCancel') || "Are you sure you want to cancel this appointment?")) return;

        setLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const res = await fetch(`/api/appointments/${appointment.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to cancel");

            setAppointment(prev => ({ ...prev, status: "cancelled" }));
            setSuccessMsg(t('cancelSuccess') || "Appointment has been cancelled.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error cancelling appointment");
        } finally {
            setLoading(false);
        }
    };

    const handleReschedule = async () => {
        if (!selectedDate || !selectedTime) {
            setError("Please select both a date and a time slot.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMsg("");

        const newDate = new Date(selectedTime);

        try {
            const res = await fetch(`/api/appointments/${appointment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: newDate.toISOString()
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to reschedule");

            setAppointment(prev => ({ 
                ...prev, 
                date: newDate, 
                status: "pending" 
            }));
            setView("overview");
            setSuccessMsg(t('rescheduleSuccess') || "Appointment successfully rescheduled!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error rescheduling appointment");
        } finally {
            setLoading(false);
        }
    };

    if (appointment.status === "cancelled") {
        return (
            <div className="p-8 text-center bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500 mb-2">
                    {t('cancelledStatus') || "Appointment Cancelled"}
                </h3>
                <p className="text-muted-foreground">
                    This appointment has been cancelled and is no longer active.
                </p>
            </div>
        );
    }

    const apptDate = new Date(appointment.date);
    const today = new Date();
    const minDateStr = today.toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            {successMsg && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-md text-green-700 text-center font-medium">
                    {successMsg}
                </div>
            )}
            
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-500 text-center font-medium">
                    {error}
                </div>
            )}

            {view === "overview" && (
                <>
                    <div className="p-6 bg-muted/30 border border-muted rounded-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">{t('customerName') || 'Customer'}</p>
                                <p className="font-semibold text-lg">{appointment.firstName} {appointment.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">{t('tireInfo') || 'Tire'}</p>
                                <p className="font-semibold text-lg">{appointment.tireName || "-"}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">{t('dateLabel') || 'Date'}</p>
                                <p className="font-semibold text-lg">{format(apptDate, "dd MMMM yyyy")}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">{t('timeLabel') || 'Time'}</p>
                                <p className="font-semibold text-lg">{format(apptDate, "HH:mm")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => setView("reschedule")}
                            className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors"
                        >
                            {t('rescheduleBtn') || "Reschedule Appointment"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-transparent border-2 border-red-500 text-red-500 font-bold rounded-md hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (t('cancelBtn') || "Cancel Appointment")}
                        </button>
                    </div>
                </>
            )}

            {view === "reschedule" && (
                <div className="space-y-6">
                    <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-md">
                        <p className="font-medium text-primary">Pick a new date and time for your appointment.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2">{t('date') || 'Select New Date'}</label>
                            <input
                                type="date"
                                id="date"
                                min={minDateStr}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-2">{t('time') || 'Select New Time'}</label>
                            <select
                                id="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                disabled={!selectedDate || fetchingSlots || slots.length === 0}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            >
                                <option value="">
                                    {!selectedDate ? "Select a date first" : fetchingSlots ? "Loading..." : slots.length === 0 ? "No available slots" : "Select time"}
                                </option>
                                {slots.map((slot) => {
                                    const dateObj = new Date(slot);
                                    const timeString = format(dateObj, "HH:mm");
                                    return (
                                        <option key={slot} value={slot}>
                                            {timeString}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleReschedule}
                            disabled={loading || !selectedDate || !selectedTime}
                            className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (t('confirmReschedule') || "Confirm New Time")}
                        </button>
                        <button
                            onClick={() => {
                                setView("overview");
                                setSelectedDate("");
                                setSelectedTime("");
                                setError("");
                            }}
                            className="py-3 px-6 bg-muted text-muted-foreground font-bold rounded-md hover:bg-muted/80 transition-colors"
                        >
                            {t('backBtn') || "Go Back"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
