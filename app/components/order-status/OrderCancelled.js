
import React from 'react';
import Link from 'next/link';
import { HelpCircle, XCircle } from 'lucide-react';

export default function OrderCancelled({ order }) {
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

                    {/* Product Card - Grayed Out */}
                    <div className="content-card" style={{ opacity: 0.7, position: 'relative', paddingTop: '40px' }}>
                        <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                            Entrega 1 de 1:
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <img src="https://via.placeholder.com/100" alt="Produto" style={{ borderRadius: '4px', filter: 'grayscale(100%)', border: '1px solid #eee' }} />
                            <div style={{ flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#333', fontWeight: '600' }}>Coleção Harry Potter (Box Completo)</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Quantidade: 1</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>R$ 259,90</div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="content-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <h3 style={{ marginBottom: '5px', color: '#c62828', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                                    <XCircle size={20} /> Pedido Cancelado
                                </h3>
                                <p style={{ color: '#666' }}>Data do Pedido: <strong>05/10/2023</strong></p>
                            </div>
                            <div>
                                <Link href="/faq" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    <HelpCircle size={16} /> Ajuda
                                </Link>
                            </div>
                        </div>

                        <div style={{ background: '#fff5f5', border: '1px solid #ffcdd2', padding: '20px', borderRadius: '8px' }}>
                            <h4 style={{ color: '#c62828', marginBottom: '10px' }}>Motivo do Cancelamento</h4>
                            <p>O pagamento via Pix não foi identificado dentro do prazo estipulado de 30 minutos. Caso tenha efetuado o pagamento, entre em contato com nosso suporte com o comprovante em mãos.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar - slightly faded */}
                <div className="details-sidebar" style={{ opacity: 0.8 }}>
                    <div className="sidebar-card">
                        <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.95rem' }}>João Pipo</div>
                        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>Rua das Flores, 123, Jardim Primavera - São Paulo/SP - CEP: 12345-678</p>

                        <div style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
                            <i className="fab fa-pix"></i> Pix (Expirado)
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <div className="summary-line">
                            <span>Total produto(s):</span>
                            <span>R$ 259,90</span>
                        </div>
                        <div className="summary-line">
                            <span>Serviços adicionais:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Frete:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line total" style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                            <span>Total do pedido:</span>
                            <span>R$ 259,90</span>
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
