"use client";
import React, { useState, useEffect } from 'react';
import { X, Construction, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PopupDisplay() {
    const [config, setConfig] = useState(null);
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Fetch config
        const fetchConfig = async () => {
            try {
                // cache: no-store to ensure we always get latest config
                const res = await fetch('/api/popup-config', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);

                    // Reset visibility if we just navigated (implicit by component re-rendering or path change)
                    // Logic for visibility
                    if (data.active) {
                        if (data.type === 'maintenance') {
                            // Always show maintenance unless in admin or login
                            // We check dismissal inside the other useEffect, or here.
                            // Let's rely on the other useEffect for the dismissal check to keep it centralized
                            // But we need to setVisible(true) initially if active to trigger the check
                            setVisible(true); // Will be gated by the other effect
                        } else {
                            // Image/Promo mode
                            // Only show on homepage if requested
                            const seen = sessionStorage.getItem('popup_seen');
                            if (!seen && pathname === '/') {
                                setTimeout(() => setVisible(true), 1500);
                            }
                        }
                    } else {
                        setVisible(false);
                    }
                }
            } catch (e) {
                console.error("Popup fetch error", e);
            }
        };
        fetchConfig();
    }, [pathname]); // Re-fetch on navigation to ensure updates are caught

    useEffect(() => {
        if (config?.active && config?.type === 'maintenance') {
            if (!isBypassRoute) {
                const maintenanceDismissed = sessionStorage.getItem('maintenance_dismissed');
                if (!maintenanceDismissed) {
                    setVisible(true);
                }
            }
        }
    }, [pathname, config]);

    const handleClose = () => {
        setVisible(false);
        if (config?.type === 'maintenance') {
            sessionStorage.setItem('maintenance_dismissed', 'true');
        } else {
            sessionStorage.setItem('popup_seen', 'true');
        }
    };

    // Bypass for Admin and Login routes
    const isBypassRoute = pathname.startsWith('/x9z4p2-k7m3v5q8-w2y1n6j4') || pathname.startsWith('/login') || pathname.startsWith('/api');

    if (isBypassRoute) return null; // Bloqueia qualquer pop-up no admin para não atrapalhar a navegação

    if (!config || !config.active || !visible) return null;

    // --- MODE: MAINTENANCE ---
    if (config.type === 'maintenance') {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(20, 20, 20, 0.98)', // Deep dark stylish background
                zIndex: 99999,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                fontFamily: 'var(--font-inter, sans-serif)',
                backdropFilter: 'blur(10px)'
            }} onClick={handleClose}>
                <div onClick={e => e.stopPropagation()} style={{
                    maxWidth: '600px',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '60px 40px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '30px',
                        boxShadow: '0 10px 20px rgba(230, 126, 34, 0.3)'
                    }}>
                        <Construction size={40} color="white" />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '-0.02em' }}>
                        Site em Manutenção
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6', marginBottom: '30px', maxWidth: '90%' }}>
                        Estamos em fase de testes e manutenção.
                        <strong style={{ color: '#e67e22', display: 'block', marginTop: '10px' }}>Por favor, não realize novas compras no momento.</strong>
                        <span style={{ display: 'block', marginTop: '10px', fontSize: '0.9rem', color: '#999' }}>
                            Caso tenha feito alguma compra anteriormente, não se preocupe, ela está segura.
                        </span>
                    </p>

                    <div style={{
                        padding: '15px 25px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: '0.95rem',
                        color: '#ddd'
                    }}>
                        <Info size={18} />
                        <span>Clique fora desta caixa para visualizar o site.</span>
                    </div>

                    <div style={{ marginTop: '40px', fontSize: '0.8rem', color: '#555' }}>
                        &copy; 2025 Loja Sebo
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE: IMAGE / PROMO ---
    if (config.type === 'image' && config.imageUrl) {
        return (
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 9000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', outline: 'none' }}
                >
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute', top: -15, right: -15,
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            zIndex: 10,
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <X size={20} color="#333" />
                    </button>

                    {config.linkUrl ? (
                        <Link href={config.linkUrl} onClick={handleClose}>
                            <img
                                src={config.imageUrl}
                                alt="Aviso Promocional"
                                style={{
                                    maxWidth: '100%', maxHeight: '85vh',
                                    width: 'auto', // Ensure aspect ratio
                                    maxWidth: '1000px', // Limite solicitado
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                    display: 'block',
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    ) : (
                        <img
                            src={config.imageUrl}
                            alt="Aviso Promocional"
                            style={{
                                maxWidth: '100%', maxHeight: '85vh',
                                width: 'auto',
                                maxWidth: '1000px', // Limite solicitado
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                display: 'block'
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    return null;
}
