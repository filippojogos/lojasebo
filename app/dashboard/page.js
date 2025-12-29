"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Wallet, Heart, X, Plus, CreditCard, QrCode } from 'lucide-react';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('dados');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="user-profile-summary">
                    <div className="avatar-circle">JP</div>
                    <div className="user-info">
                        <h3>João Pipo</h3>
                        <span>joao@email.com</span>
                    </div>
                </div>
                <nav className="dashboard-nav">
                    <button onClick={() => setActiveTab('dados')} className={activeTab === 'dados' ? 'active' : ''}>
                        <User size={18} /> Meus Dados
                    </button>
                    <button onClick={() => setActiveTab('pedidos')} className={activeTab === 'pedidos' ? 'active' : ''}>
                        <Package size={18} /> Meus Pedidos
                    </button>
                    <button onClick={() => setActiveTab('enderecos')} className={activeTab === 'enderecos' ? 'active' : ''}>
                        <MapPin size={18} /> Endereços
                    </button>
                    <button onClick={() => setActiveTab('carteira')} className={activeTab === 'carteira' ? 'active' : ''}>
                        <Wallet size={18} /> Carteira
                    </button>
                    <Link href="/favoritos" className={activeTab === 'favoritos' ? 'active' : ''}>
                        <Heart size={18} /> Favoritos
                    </Link>
                    <Link href="/" className="text-danger">
                        Sair
                    </Link>
                </nav>
            </aside>

            {/* Content Area */}
            <main className="dashboard-content">

                {/* Meus Dados */}
                {activeTab === 'dados' && (
                    <div className="dashboard-tab active">
                        <h2 className="section-title">Meus Dados</h2>
                        <form className="dashboard-form" onSubmit={(e) => { e.preventDefault(); alert('Dados salvos com sucesso!'); }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nome Completo</label>
                                    <input type="text" defaultValue="João Pipo" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CPF</label>
                                    <input type="text" defaultValue="123.456.789-00" readOnly style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f9f9f9', color: '#999' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>E-mail</label>
                                    <input type="email" defaultValue="joao@email.com" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Celular</label>
                                    <input type="text" defaultValue="(11) 99999-9999" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <button type="submit" className="btn-cta">Salvar Alterações</button>
                        </form>
                    </div>
                )}

                {/* Meus Pedidos */}
                {activeTab === 'pedidos' && (
                    <div className="dashboard-tab active">
                        <h2 className="section-title">Meus Pedidos</h2>
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#f9f9f9', borderRadius: '8px' }}>
                            <Package size={48} style={{ margin: '0 auto 15px', color: '#ddd' }} />
                            <h3>Você ainda não fez nenhum pedido.</h3>
                            <Link href="/" className="btn-cta" style={{ marginTop: '20px', display: 'inline-block' }}>
                                Começar a Comprar
                            </Link>
                        </div>
                    </div>
                )}

                {/* Endereços */}
                {activeTab === 'enderecos' && (
                    <div className="dashboard-tab active">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Meus Endereços</h2>
                            <button className="btn-cta" onClick={() => setShowAddressModal(true)} style={{ padding: '8px 15px', fontSize: '0.9rem' }}>
                                + Novo Endereço
                            </button>
                        </div>

                        <div className="address-card">
                            <div className="address-header">
                                <h4>Minha Casa</h4>
                                <div className="actions">✏️ 🗑️</div>
                            </div>
                            <p>João Pipo</p>
                            <p>Rua dos Bobos, 0 - Jardim das Flores</p>
                            <p>São Paulo - SP - CEP: 01234-567</p>
                        </div>
                    </div>
                )}

                {/* Carteira */}
                {activeTab === 'carteira' && (
                    <div className="dashboard-tab active">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Minha Carteira</h2>
                            <button className="btn-buy" onClick={() => setShowCardModal(true)} style={{ width: 'auto' }}>
                                + Novo Cartão
                            </button>
                        </div>
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999', border: '2px dashed #eee', borderRadius: '8px' }}>
                            <Wallet size={48} style={{ margin: '0 auto 15px', color: '#ddd' }} />
                            <p>Nenhum cartão cadastrado.</p>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
