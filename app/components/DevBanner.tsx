"use client";

import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

export default function DevBanner() {
    const t = useTranslations('DevBanner');

    return (
        <div className="bg-amber-500 text-white py-2 px-4 shadow-md">
            <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{t('message')}</p>
            </div>
        </div>
    );
}
