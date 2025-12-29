
import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, HelpCircle, Truck, AlertTriangle } from 'lucide-react';

export default function OrderOnWay({ order }) {
    const [showCancelModal, setShowCancelModal] = useState(false);

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
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#333', fontWeight: '600' }}>O Senhor dos Anéis + 2 itens</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Quantidade: 1</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>R$ 329,80</div>
                        </div>
                    </div>

                    {/* Status & Timeline Card */}
                    <div className="content-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <h3 style={{ marginBottom: '5px', fontSize: '1.2rem' }}>A Caminho</h3>
                                <p style={{ color: '#666' }}>Chegada prevista: 26 de Dezembro</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold' }}>
                                    <FileText size={16} /> 2ª Via da Nota Fiscal
                                </button>
                                <Link href="/faq" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    <HelpCircle size={16} /> Preciso de Ajuda
                                </Link>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', margin: '20px 0' }}></div>

                        <h4 style={{ marginBottom: '30px', fontSize: '0.95rem', color: '#333', fontWeight: '600' }}>Rastreio (Transportadora: GFL Logística)</h4>

                        <div className="timeline-container" style={{ margin: '40px 0' }}>
                            <div className="timeline-line">
                                <div className="timeline-progress" style={{ width: '65%' }}>
                                    <div className="truck-icon" style={{ right: '-15px', position: 'absolute', top: '-24px', background: 'white', padding: '2px', color: 'var(--primary-orange)' }}>
                                        <Truck size={24} />
                                    </div>
                                </div>
                            </div>
                            <div className="timeline-points">
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Pedido Recebido</div>
                                    <div className="point-date">20/12</div>
                                </div>
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Nota Fiscal</div>
                                    <div className="point-date">21/12</div>
                                </div>
                                <div className="point active">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Em Trânsito</div>
                                    <div className="point-date">22/12</div>
                                </div>
                                <div className="point">
                                    <div className="point-dot"></div>
                                    <div className="point-label">Entregue</div>
                                    <div className="point-date">--/--</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Card */}
                    <div className="content-card">
                        <h4 style={{ marginBottom: '20px' }}>Histórico Completo</h4>
                        <div className="tracking-step">
                            <div className="step-dot active"></div>
                            <div className="step-info">
                                <h5>Mercadoria em trânsito entre Centros de Distribuição</h5>
                                <p>São Paulo, SP</p>
                                <small>23/12/2023 - 08:30</small>
                            </div>
                        </div>
                        <div className="tracking-step">
                            <div className="step-dot active"></div>
                            <div className="step-info">
                                <h5>Coletado pela Transportadora</h5>
                                <p>Barueri, SP</p>
                                <small>22/12/2023 - 14:15</small>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', padding: '10px' }}>
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="btn-outline"
                            style={{ borderColor: '#e74c3c', color: '#e74c3c', fontSize: '0.85rem' }}
                        >
                            Cancelar este Pedido
                        </button>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="details-sidebar">
                    <div className="sidebar-card">
                        <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.95rem' }}>João Pipo</div>
                        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>Av. Paulista, 1000, Sala 42, Bela Vista - São Paulo/SP - CEP: 01310-100</p>

                        <div style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
                            <i className="fas fa-credit-card"></i> Cartão de Crédito (Pago)
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <div className="summary-line">
                            <span>Total produto(s):</span>
                            <span>R$ 329,80</span>
                        </div>
                        <div className="summary-line">
                            <span>Serviços adicionais:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Frete:</span>
                            <span>R$ 22,50</span>
                        </div>
                        <div className="summary-line" style={{ color: '#27ae60' }}>
                            <span>Desconto:</span>
                            <span>- R$ 32,98</span>
                        </div>
                        <div className="summary-line total" style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                            <span>Total do pedido:</span>
                            <span>R$ 324,32</span>
                        </div>
                    </div>

                    <Link href="/minha-conta/pedidos" className="btn-outline btn-outline-orange btn-block" style={{ textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', borderWidth: '1px', textTransform: 'uppercase', fontSize: '0.85rem', padding: '12px', display: 'block' }}>
                        <i className="fas fa-chevron-left" style={{ marginRight: '5px' }}></i> VOLTAR AOS MEUS PEDIDOS
                    </Link>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="modal">
                        <h3 style={{ color: '#e74c3c', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle size={24} /> Cancelar Pedido
                        </h3>
                        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Tem certeza que deseja cancelar?</p>
                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>
                            <p style={{ marginBottom: '10px' }}>Política de Cancelamento:</p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>O cancelamento é irreversível.</li>
                                <li>O reembolso será processado na mesma forma de pagamento em até 5 dias úteis.</li>
                                <li>Se o produto já estiver em rota de entrega, recuse o recebimento.</li>
                            </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn-outline" onClick={() => setShowCancelModal(false)}>Não, manter pedido</button>
                            <button className="btn-cta" style={{ background: '#e74c3c' }} onClick={() => { alert('Cancelado!'); setShowCancelModal(false); }}>Sim, tenho certeza</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
