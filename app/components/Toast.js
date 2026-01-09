"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            background: type === 'success' ? '#27ae60' : '#c0392b',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontWeight: '500',
            minWidth: '300px'
        }}>
            {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}
            >
                <X size={18} />
            </button>
        </div>
    );
}
