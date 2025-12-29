"use client";

import React from 'react';
import Link from 'next/link';

export default function PedidosPage() {
    return (
        <div>
            <h2 className="section-title">Meus Pedidos</h2>

            <div id="orders-list-container">
                {/* Order 1 Summary */}
                <div className="order-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <strong>Pedido #9842</strong>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}> • 20/12/2023</span>
                        </div>
                        <span className="order-status status-transit">A Caminho</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src="https://via.placeholder.com/60" style={{ borderRadius: '4px' }} alt="Produto" />
                        <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1rem' }}>O Senhor dos Anéis + 2 itens</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Chega dia 26/12</p>
                        </div>
                        <Link href="/minha-conta/pedidos/9842" className="btn-outline btn-outline-orange" style={{ fontSize: '0.8rem' }}>
                            Ver Detalhes
                        </Link>
                    </div>
                </div>

                {/* Order 2 Summary (Delivered) */}
                <div className="order-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <strong>Pedido #8650</strong>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}> • 10/11/2023</span>
                        </div>
                        <span className="order-status" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Entregue</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src="https://via.placeholder.com/60" style={{ borderRadius: '4px' }} alt="Produto" />
                        <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1rem' }}>Super Mario World (SNES)</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Entregue em 15/11</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link href="/minha-conta/pedidos/devolucao" className="btn-outline btn-outline-orange" style={{ fontSize: '0.8rem' }}>
                                Devolver Item
                            </Link>
                            <Link href="/minha-conta/pedidos/8650" className="btn-outline btn-outline-orange" style={{ fontSize: '0.8rem' }}>
                                Ver Detalhes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Order 4 Summary (Pending - SIMULATION) */}
                <div className="order-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <strong>Pedido #1111</strong>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}> • Hoje</span>
                        </div>
                        <span className="order-status" style={{ background: '#fff8e1', color: '#f57f17', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Pendente</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src="https://via.placeholder.com/60" style={{ borderRadius: '4px' }} alt="Produto" />
                        <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1rem' }}>Batman: O Cavaleiro das Trevas (HQ)</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Aguardando Pagamento</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-outline btn-outline-orange" onClick={() => alert("Simulando download do boleto...")} style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                                2ª Via do Boleto
                            </button>
                            <Link href="/minha-conta/pedidos/1111" className="btn-cta" style={{ fontSize: '0.8rem', padding: '8px 12px', textDecoration: 'none' }}>
                                Pagar Agora
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Order 3 Summary (Cancelled) */}
                <div className="order-card" style={{ opacity: 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <strong style={{ textDecoration: 'lineThrough', color: '#999' }}>Pedido #7021</strong>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}> • 05/10/2023</span>
                        </div>
                        <span className="order-status" style={{ background: '#ffebee', color: '#c62828', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Cancelado</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src="https://via.placeholder.com/60" style={{ borderRadius: '4px', filter: 'grayscale(100%)' }} alt="Produto" />
                        <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1rem', color: '#999' }}>Coleção Harry Potter (Box Completo)</h4>
                            <p style={{ fontSize: '0.9rem', color: '#999' }}>Cancelado pelo cliente</p>
                        </div>
                        <Link href="/minha-conta/pedidos/7021" className="btn-outline" style={{ fontSize: '0.8rem', color: '#999', borderColor: '#ddd' }}>
                            Ver Detalhes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
