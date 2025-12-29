
import React from 'react';
import Link from 'next/link';
import { FileText, HelpCircle, CheckCircle, Package } from 'lucide-react';

export default function OrderDelivered({ order }) {
    return (
        <div className="order-details-wrapper">
            {/* Title with Orange Pipe */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ width: '5px', height: '30px', background: 'var(--primary-orange)', marginRight: '15px' }}></div>
                <h1 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Detalhes do Pedido #{order.id}</h1>
            </div>

            <div className="order-details-container">
                {/* Left Column: Main Content */}
                <div className="details-main">

                    {/* Product Card with "Entrega 1 de 1" */}
                    <div className="content-card" style={{ position: 'relative', paddingTop: '40px' }}>
                        <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                            Entrega 1 de 1:
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <img src="https://via.placeholder.com/100" alt="Produto" style={{ borderRadius: '4px', border: '1px solid #eee' }} />
                            <div style={{ flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#333', fontWeight: '600' }}>Super Mario World (SNES)</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Quantidade: 1</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>R$ 149,90</div>
                        </div>
                    </div>

                    {/* Status & Timeline Card */}
                    <div className="content-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <h3 style={{ marginBottom: '5px', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                                    <CheckCircle size={20} /> Pedido Entregue
                                </h3>
                                <p style={{ color: '#666' }}>Entregue em: <strong>15 de Novembro de 2023</strong></p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold' }}>
                                    <FileText size={16} /> Nota Fiscal
                                </button>
                                <Link href="/faq" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    <HelpCircle size={16} /> Ajuda
                                </Link>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', margin: '20px 0' }}></div>

                        <div className="timeline-container" style={{ margin: '40px 0' }}>
                            <div className="timeline-line">
                                <div className="timeline-progress" style={{ width: '100%', borderRadius: '2px' }}></div>
                            </div>
                            <div className="timeline-points">
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Pedido Recebido</div>
                                    <div className="point-date">10/11</div>
                                </div>
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Nota Fiscal</div>
                                    <div className="point-date">11/11</div>
                                </div>
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Em Trânsito</div>
                                    <div className="point-date">12/11</div>
                                </div>
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Entregue</div>
                                    <div className="point-date">15/11</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '30px' }}>
                            <Link href="/minha-conta/pedidos/devolucao" className="btn-outline" style={{ borderColor: '#e74c3c', color: '#e74c3c', textDecoration: 'none', display: 'inline-block', fontSize: '0.85rem' }}>
                                Devolver este Item
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="details-sidebar">
                    <div className="sidebar-card">
                        <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.95rem' }}>João Pipo</div>
                        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>Rua das Flores, 123, Jardim Primavera - São Paulo/SP - CEP: 12345-678</p>

                        <div style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
                            <i className="fas fa-credit-card"></i> Cartão de Crédito (Final 4829)
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <div className="summary-line">
                            <span>Total produto(s):</span>
                            <span>R$ 149,90</span>
                        </div>
                        <div className="summary-line">
                            <span>Serviços adicionais:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Frete:</span>
                            <span>R$ 15,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Desconto:</span>
                            <span>- R$ 0,00</span>
                        </div>
                        <div className="summary-line total" style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                            <span>Total do pedido:</span>
                            <span>R$ 164,90</span>
                        </div>
                    </div>

                    <Link href="/minha-conta/pedidos" className="btn-outline btn-outline-orange btn-block" style={{ textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', borderWidth: '1px', textTransform: 'uppercase', fontSize: '0.85rem', padding: '12px', display: 'block' }}>
                        <i className="fas fa-chevron-left" style={{ marginRight: '5px' }}></i> VOLTAR AOS MEUS PEDIDOS
                    </Link>
                </div>
            </div>
        </div>
    );
}
