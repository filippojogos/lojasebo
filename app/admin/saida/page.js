"use client";

import React, { useState, useEffect } from 'react';
import { Package, Truck, Printer, AlertCircle, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos'); // todos, pago, enviado

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (filter === 'todos') return true;
        return o.status === filter;
    });

    const handlePrintLabel = (orderId) => {
        alert(`Gerando etiqueta do Super Frete para o pedido #${orderId}...\n(Simulação de PDF)`);
    };

    const handleMarkShipped = (orderId) => {
        alert(`Pedido #${orderId} marcado como ENVIADO!`);
        // In real app, would call API to update status
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'enviado' } : o));
    };

    if (loading) return <div>Carregando Pedidos...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#2c3e50' }}>Saída (Envios)</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <FilterButton active={filter === 'todos'} onClick={() => setFilter('todos')} label="Todos" />
                    <FilterButton active={filter === 'pago'} onClick={() => setFilter('pago')} label="A Enviar" count={orders.filter(o => o.status === 'pago').length} />
                    <FilterButton active={filter === 'enviado'} onClick={() => setFilter('enviado')} label="Enviados" />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {filteredOrders.map(order => (
                    <div key={order.id} style={{ borderBottom: '1px solid #eee', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <h3 style={{ margin: 0, color: '#333' }}>Pedido #{order.id}</h3>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div style={{ color: '#777', fontSize: '0.9rem' }}>
                                    {new Date(order.data).toLocaleDateString()} às {new Date(order.data).toLocaleTimeString()} | <strong>{order.cliente.nome}</strong>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2c3e50' }}>R$ {order.total.toFixed(2).replace('.', ',')}</div>
                                <div style={{ fontSize: '0.85rem', color: '#999' }}>{order.pagamento}</div>
                            </div>
                        </div>

                        {/* Order Items & Address Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                            {/* Items */}
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#555', marginBottom: '10px', textTransform: 'uppercase' }}>Itens do Pedido</div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {order.itens.map((item, idx) => (
                                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', color: '#444' }}>
                                            <span>{item.qtd}x {item.produto}</span>
                                            <span style={{ fontWeight: 'bold' }}>R$ {item.preco.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Address & Actions */}
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#555', marginBottom: '10px', textTransform: 'uppercase' }}>Endereço de Entrega</div>
                                {order.cliente.endereco ? (
                                    <div style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.5', marginBottom: '15px' }}>
                                        {order.cliente.endereco.rua}, {order.cliente.endereco.numero}<br />
                                        {order.cliente.endereco.bairro} - {order.cliente.endereco.cidade}/{order.cliente.endereco.uf}<br />
                                        CEP: {order.cliente.endereco.cep}
                                    </div>
                                ) : (
                                    <div style={{ color: '#c0392b', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
                                        <AlertCircle size={16} /> Endereço não cadastrado!
                                    </div>
                                )}

                                {order.status === 'pago' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handlePrintLabel(order.id)}
                                            disabled={!order.cliente.endereco}
                                            style={{ flex: 1, background: '#3498db', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', opacity: !order.cliente.endereco ? 0.5 : 1 }}
                                        >
                                            <Printer size={16} /> Etiqueta PDF
                                        </button>
                                        <button
                                            onClick={() => handleMarkShipped(order.id)}
                                            style={{ flex: 1, background: '#27ae60', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                        >
                                            <Truck size={16} /> Despachar
                                        </button>
                                    </div>
                                )}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
        cancelado: { bg: '#f8d7da', color: '#721c24', text: 'Cancelado' }
    };
    const s = styles[status] || styles.pago;

    return (
        <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {s.text}
        </span>
    );
}
