"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, CreditCard, Heart, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

    return (
        <aside className="dashboard-sidebar">
            <div className="user-profile-summary">
                <div className="avatar-circle">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JP'}
                </div>
                <div className="user-info">
                    <h3>{user?.name || 'João Pipo'}</h3>
                    <span>{user?.email || 'joao@email.com'}</span>
                </div>
            </div>
            <nav className="dashboard-nav">
                <button onClick={logout} className="text-danger" style={{ background: 'none', border: '1px solid #ffcccc', borderRadius: '8px', width: '100%', cursor: 'pointer', padding: '12px 15px', fontSize: '1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#e74c3c' }}>
                    <LogOut size={18} /> Sair
                </button>

                <Link href="/minha-conta/dados" className={isActive('/minha-conta/dados') ? 'active' : ''}>
                    <User size={18} /> Meus Dados
                </Link>
                <Link href="/minha-conta/pedidos" className={isActive('/minha-conta/pedidos') ? 'active' : ''}>
                    <Package size={18} /> Meus Pedidos
                </Link>
                <Link href="/minha-conta/enderecos" className={isActive('/minha-conta/enderecos') ? 'active' : ''}>
                    <MapPin size={18} /> Endereços
                </Link>

                <Link href="/favoritos" className={isActive('/favoritos') ? 'active' : ''}>
                    <Heart size={18} /> Favoritos
                </Link>
                <Link href="/minha-conta/deletar-conta" className={isActive('/minha-conta/deletar-conta') ? 'active' : ''} style={{ color: '#e74c3c' }}>
                    <Trash2 size={18} /> Deletar Conta
                </Link>
            </nav>
        </aside>
    );
}
