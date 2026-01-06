"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, LogOut, LayoutGrid, PlusCircle } from 'lucide-react';
import '../globals.css'; // Ensure global styles are loaded

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    useEffect(() => {
        // Simple client-side auth check
        const hasToken = document.cookie.includes('admin_token=true');
        if (!hasToken && pathname !== '/x9z4p2-k7m3v5q8-w2y1n6j4/login') {
            router.push('/x9z4p2-k7m3v5q8-w2y1n6j4/login');
        } else {
            setLoading(false);
        }

        // Fetch pending orders for badge
        const fetchBadge = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        const count = data.filter(o => o.status === 'pago').length;
                        setPendingOrdersCount(count);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch badge:", e);
            }
        };

        if (hasToken && pathname !== '/x9z4p2-k7m3v5q8-w2y1n6j4/login') {
            fetchBadge();
        }
    }, [pathname]);

    if (loading) return null; // Or a spinner

    if (pathname === '/x9z4p2-k7m3v5q8-w2y1n6j4/login') {
        return <>{children}</>;
    }

    const isActive = (path) => pathname === path;

    const navLinkStyle = (path) => ({
        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px',
        borderRadius: '8px', textDecoration: 'none', color: isActive(path) ? 'white' : '#bdc3c7',
        background: isActive(path) ? '#34495e' : 'transparent',
        fontWeight: isActive(path) ? 'bold' : 'normal',
        position: 'relative'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Admin Sidebar */}
            <aside style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #34495e' }}>
                    Sebo Admin
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/dashboard" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/dashboard')}>
                        <LayoutGrid size={20} /> Dashboard
                    </Link>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/produtos" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/produtos')}>
                        <Package size={20} /> Produtos
                    </Link>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/clientes" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/clientes')}>
                        <LayoutGrid size={20} /> Clientes
                    </Link>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/saida" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/saida')}>
                        <Package size={20} /> Saída (Pedidos)
                        {pendingOrdersCount > 0 && (
                            <span style={{
                                position: 'absolute', right: '15px', background: '#e74c3c',
                                color: 'white', fontSize: '0.7rem', fontWeight: 'bold',
                                padding: '2px 8px', borderRadius: '10px'
                            }}>
                                {pendingOrdersCount}
                            </span>
                        )}
                    </Link>

                    <div style={{ height: '1px', background: '#34495e', margin: '10px 0' }}></div>

                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/produtos/novo" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/produtos/novo')}>
                        <PlusCircle size={20} /> Novo Produto
                    </Link>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/banners" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/banners')}>
                        <LayoutGrid size={20} /> Banners e Pop-up
                    </Link>
                    <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/destaques" style={navLinkStyle('/x9z4p2-k7m3v5q8-w2y1n6j4/destaques')}>
                        <Package size={20} /> Vitrines (Home)
                    </Link>
                </nav>

                <button
                    onClick={() => {
                        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                        router.push('/x9z4p2-k7m3v5q8-w2y1n6j4/login');
                    }}
                    style={{
                        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px', background: 'none', border: 'none', color: '#e74c3c',
                        cursor: 'pointer', fontSize: '1rem'
                    }}
                >
                    <LogOut size={20} /> Sair
                </button>
            </aside>

            {/* Content Content */}
            <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
