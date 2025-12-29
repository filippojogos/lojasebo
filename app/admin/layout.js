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

    useEffect(() => {
        // Simple client-side auth check
        const hasToken = document.cookie.includes('admin_token=true');
        if (!hasToken && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setLoading(false);
        }
    }, [pathname]);

    if (loading) return null; // Or a spinner

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isActive = (path) => pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Admin Sidebar */}
            <aside style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #34495e' }}>
                    Sebo Admin
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Link href="/admin/produtos"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px',
                            borderRadius: '8px', textDecoration: 'none', color: isActive('/admin/produtos') ? 'white' : '#bdc3c7',
                            background: isActive('/admin/produtos') ? '#34495e' : 'transparent',
                            fontWeight: isActive('/admin/produtos') ? 'bold' : 'normal'
                        }}
                    >
                        <Package size={20} /> Produtos
                    </Link>
                    <Link href="/admin/produtos/novo"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px',
                            borderRadius: '8px', textDecoration: 'none', color: isActive('/admin/produtos/novo') ? 'white' : '#bdc3c7',
                            background: isActive('/admin/produtos/novo') ? '#34495e' : 'transparent',
                            fontWeight: isActive('/admin/produtos/novo') ? 'bold' : 'normal'
                        }}
                    >
                        <PlusCircle size={20} /> Novo Produto
                    </Link>
                </nav>

                <button
                    onClick={() => {
                        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                        router.push('/admin/login');
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
