'use client';

import { useEffect } from 'react';

/**
 * Invisible component that periodically pings /api/heartbeat
 * to process pending abandoned checkout emails.
 * Fires once immediately on mount, then every 5 minutes.
 */
export default function AbandonedCheckoutHeartbeat() {
    useEffect(() => {
        const ping = () => {
            fetch('/api/heartbeat').catch(() => {});
        };

        // Fire immediately
        ping();

        // Then every 5 minutes
        const interval = setInterval(ping, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
