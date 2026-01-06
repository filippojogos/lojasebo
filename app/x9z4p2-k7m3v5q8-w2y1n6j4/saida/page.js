"use client";

import React, { useState, useEffect } from 'react';
import { Package, Truck, Printer, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            // Ensure data is array
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`Tem certeza que deseja apagar o pedido #${id}? Essa ação não pode ser desfeita.`)) return;

        try {
            const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== id));
            } else {
                alert("Erro ao apagar");
            }
        } catch (e) {
            alert("Erro de conexão");
        }
    };

    const filteredOrders = orders.filter(o => {
        if (filter === 'todos') return true;
        return o.status === filter;
    });

    const handlePrintLabel = (orderId) => {
        alert(`Gerando etiqueta do Super Frete para o pedido #${orderId}...\n(Simulação de PDF)`);
    };

    if (loading) return <div style={{ padding: 40 }}>Carregando Pedidos...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.push('/x9z4p2-k7m3v5q8-w2y1n6j4')} className="btn-outline">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>Saída (Envios)</h1>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Gerencie as remessas e etiquetas</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <FilterButton active={filter === 'todos'} onClick={() => setFilter('todos')} label="Todos" />
                    <FilterButton active={filter === 'pago'} onClick={() => setFilter('pago')} label="A Enviar" count={orders.filter(o => o.status === 'pago').length} />
                    <FilterButton active={filter === 'enviado'} onClick={() => setFilter('enviado')} label="Enviados" />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {filteredOrders.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Nenhum pedido encontrado.</div>}
                {filteredOrders.map(order => (
                    <div key={order.id} style={{ borderBottom: '1px solid #eee', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <h3 style={{ margin: 0, color: '#333' }}>Pedido #{order.id}</h3>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div style={{ color: '#777', fontSize: '0.9rem' }}>
                                    {order.data ? new Date(order.data).toLocaleDateString() : 'Data N/A'} | <strong>{order.user?.nome || "Cliente Desconhecido"}</strong>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2c3e50' }}>R$ {order.total?.toFixed(2).replace('.', ',')}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#999' }}>{order.pagamento}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    style={{ background: '#fff0f0', color: 'red', border: '1px solid #ffcccc', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <Trash2 size={14} /> Excluir
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#555', marginBottom: '10px', textTransform: 'uppercase' }}>Itens</div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {order.items && Array.isArray(order.items) ? order.items.map((item, idx) => (
                                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', color: '#444' }}>
                                            <span>{item.qty || 1}x {item.nome || item.produto}</span>
                                            <span style={{ fontWeight: 'bold' }}>R$ {item.price ? item.price : item.preco}</span>
                                        </li>
                                    )) : <li>Itens indisponíveis</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label, count }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: active ? '#2c3e50' : 'white',
                color: active ? 'white' : '#555',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '8px'
            }}
        >
            {label}
            {count !== undefined && <span style={{ background: active ? 'white' : '#e74c3c', color: active ? '#2c3e50' : 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>{count}</span>}
        </button>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pago: { bg: '#fff3cd', color: '#856404', text: 'A Enviar' },
        enviado: { bg: '#d4edda', color: '#155724', text: 'Enviado' },
        pendente_pagamento: { bg: '#eee', color: '#666', text: 'Pendente' },
        cancelado: { bg: '#f8d7da', color: '#721c24', text: 'Cancelado' }
    };
    const s = styles[status] || styles.pago;

    return (
        <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {s.text}
        </span>
    );
}
