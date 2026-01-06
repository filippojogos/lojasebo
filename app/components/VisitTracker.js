"use client";
import { useEffect } from 'react';

export default function VisitTracker() {
    useEffect(() => {
        // Simple session check to avoid counting F5 refreshes too much
        if (!sessionStorage.getItem('visit_counted')) {
            fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'visit' })
            }).catch(() => { });
            sessionStorage.setItem('visit_counted', 'true');
        }
    }, []);
    return null;
}
