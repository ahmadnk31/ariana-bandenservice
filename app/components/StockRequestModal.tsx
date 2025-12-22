"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

interface StockRequestModalProps {
    tireId: string;
    tireName: string;
    onClose: () => void;
}

export default function StockRequestModal({ tireId, tireName, onClose }: StockRequestModalProps) {
    const t = useTranslations("Tires");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/tires/request-stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tireId,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit request");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-card border border-muted rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{t("stockRequestTitle")}</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        {t("stockRequestSubtitle")}
                    </p>

                    {success ? (
                        <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20 text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-500 mx-auto mb-3"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <p className="text-sm font-medium">{t("stockRequestSuccess")}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 text-sm font-bold text-primary hover:underline"
                            >
                                {t("backToTires")}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                                    {t("name")}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-muted bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                    {t("email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-muted bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                                    {t("phone")}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-muted bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            {error && <p className="text-xs text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 rounded-md bg-primary text-primary-foreground font-bold shadow transition-colors hover:bg-primary/90 disabled:opacity-50 mt-2"
                            >
                                {loading ? t("sending") : t("submitRequest")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
