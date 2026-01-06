"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MaintenancePopup() {
    const [config, setConfig] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Fetch config on mount
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/popup-config');
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);

                    // Check if already seen in this session (unless it's maintenance, which always shows)
                    const seen = sessionStorage.getItem('popup_seen');

                    if (data.active) {
                        if (data.type === 'maintenance') {
                            setVisible(true); // Always show maintenance
                        } else if (!seen) {
                            // Show promo with delay
                            setTimeout(() => setVisible(true), 1000);
                        }
                    }
                }
            } catch (e) {
                console.error("Popup config error", e);
            }
        };
        fetchConfig();
    }, []);

    const handleClose = () => {
        setVisible(false);
        if (config?.type !== 'maintenance') {
            sessionStorage.setItem('popup_seen', 'true');
        }
    };

    if (!config || !visible) return null;

    // MAINTENANCE MODE (High Z-Index, Blocking)
    if (config.type === 'maintenance') {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: 99999,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'black'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>SITE EM MANUTENÇÃO</h1>
                <p style={{ fontSize: '1.2rem', color: '#555' }}>Estamos ajustando as estantes. Volte em instantes!</p>
                <div style={{ marginTop: '20px', padding: '10px 20px', background: '#f0f0f0', borderRadius: '8px', fontSize: '0.9rem' }}>
                    Compras temporariamente desativadas.
                </div>
            </div>
        );
    }

    // IMAGE / PROMO MODE (Overlay, Closable)
    if (config.type === 'image' && config.imageUrl) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={handleClose}>
                <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute', top: -15, right: -15,
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        <X size={20} />
                    </button>
                    <img src={config.imageUrl} alt="Aviso" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                </div>
            </div>
        );
    }

    return null;
}
