"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function PedidosPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) throw new Error('Falha ao carregar pedidos');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar seus pedidos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando pedidos...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

    if (orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <Package size={48} color="#ddd" style={{ marginBottom: '15px' }} />
                <h3 style={{ color: '#555', marginBottom: '10px' }}>Nenhum pedido encontrado</h3>
                <p style={{ color: '#999', marginBottom: '20px' }}>Você ainda não realizou nenhuma compra conosco.</p>
                <Link href="/" className="btn-cta">
                    Ir às Compras
                </Link>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'entregue': return { bg: '#e8f5e9', color: '#2e7d32', label: 'Entregue', icon: CheckCircle };
            case 'cancelado': return { bg: '#ffebee', color: '#c62828', label: 'Cancelado', icon: XCircle };
            case 'enviado': return { bg: '#e3f2fd', color: '#1976d2', label: 'A Caminho', icon: Package };
            default: return { bg: '#fff8e1', color: '#f57f17', label: 'Pendente', icon: Clock };
        }
    };

    return (
        <div>
            <h2 className="section-title">Meus Pedidos</h2>

            <div id="orders-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map(order => {
                    const statusConfig = getStatusStyle(order.status);
                    const StatusIcon = statusConfig.icon;
                    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                    const otherItemsCount = order.items ? order.items.length - 1 : 0;
                    const date = new Date(order.data).toLocaleDateString('pt-BR');

                    return (
                        <div key={order.id} className="order-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem', color: '#333' }}>Pedido #{order.id}</strong>
                                    <span style={{ color: '#999', fontSize: '0.9rem', marginLeft: '10px' }}>• {date}</span>
                                </div>
                                <span className="order-status" style={{ background: statusConfig.bg, color: statusConfig.color, padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <StatusIcon size={14} /> {statusConfig.label}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                {firstItem ? (
                                    <div style={{ width: '70px', height: '70px', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={firstItem.imagem || 'https://via.placeholder.com/70'} alt={firstItem.nome} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                ) : (
                                    <div style={{ width: '70px', height: '70px', background: '#eee', borderRadius: '8px' }}></div>
                                )}

                                <div style={{ flexGrow: 1 }}>
                                    {firstItem ? (
                                        <>
                                            <h4 style={{ fontSize: '1rem', color: '#444', marginBottom: '5px' }}>
                                                {firstItem.nome}
                                                {otherItemsCount > 0 && <span style={{ fontWeight: 'normal', color: '#888' }}> + {otherItemsCount} item(s)</span>}
                                            </h4>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-orange)' }}>
                                                R$ {order.total.toFixed(2).replace('.', ',')}
                                            </div>
                                        </>
                                    ) : (
                                        <span>Detalhes indisponíveis</span>
                                    )}
                                </div>

                                <div>
                                    <Link href={`/minha-conta/pedidos/${order.id}`} className="btn-outline btn-outline-orange" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                                        Ver Detalhes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
