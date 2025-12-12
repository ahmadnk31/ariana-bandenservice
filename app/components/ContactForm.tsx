"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';

interface Service {
    id: string;
    name: string;
}

interface ContactFormProps {
    services?: Service[];
    initialService?: string;
}

export default function ContactForm({ services = [], initialService = "" }: ContactFormProps) {
    const t = useTranslations('Contact');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: initialService,
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setSuccess(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                service: "",
                message: "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : t('error'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-8 rounded-lg border border-green-500/50 bg-green-500/10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mx-auto mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 className="text-xl font-bold mb-2">{t('messageSentTitle')}</h3>
                <p className="text-muted-foreground mb-4">
                    {t('thankYouMessage')}
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-primary hover:underline"
                >
                    {t('sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        {t('firstName')} *
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        {t('lastName')} *
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Doe"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('email')} *
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    {t('phoneOptional')}
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="+31 6 12345678"
                />
            </div>
            <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                    {t('service')}
                </label>
                <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                    <option value="">{t('selectService')}</option>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <option key={service.id} value={service.name}>
                                {service.name}
                            </option>
                        ))
                    ) : (
                        <>
                            <option value="tire-fitting">Tire Fitting</option>
                            <option value="balancing">Wheel Balancing</option>
                            <option value="alignment">Wheel Alignment</option>
                            <option value="repair">Puncture Repair</option>
                            <option value="storage">Tire Storage</option>
                            <option value="inspection">Tire Inspection</option>
                            <option value="other">Other</option>
                        </>
                    )}
                </select>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('message')} *
                </label>
                <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your needs..."
                ></textarea>
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-medium shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
                {loading ? t('sending') : t('submit')}
            </button>
        </form>
    );
}
