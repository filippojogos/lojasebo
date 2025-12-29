
import React from 'react';
import Link from 'next/link';
import { FileText, HelpCircle, Truck, AlertTriangle } from 'lucide-react';

export default function OrderVisualTest() {
    // Hardcoded data to match the image exactly
    const orderId = "9842";

    return (
        <div className="order-details-wrapper">
            {/* Title with Orange Pipe */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ width: '5px', height: '30px', background: 'var(--primary-orange)', marginRight: '15px' }}></div>
                <h1 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Detalhes do Pedido #{orderId}</h1>
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
                                <h3 style={{ fontSize: '1rem', marginBottom: '5px', color: '#333', fontWeight: '600' }}>Memória Corsair Vengeance RT, RGB, 32GB (2x16GB), 4600MHz, DDR4, CL18, Preto - CMN32GX4M2Z4600C18</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>Quantidade: 1</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>R$ 1.235,28</div>
                        </div>
                    </div>

                    {/* Status Card */}
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
                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-purple)', borderColor: 'var(--deep-purple)', fontWeight: 'bold' }}>
                                    <HelpCircle size={16} /> Preciso de Ajuda
                                </button>
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
                </div>

                {/* Right Column: Sidebar */}
                <div className="details-sidebar">
                    <div className="sidebar-card">
                        <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.95rem' }}>Filippo Salton Mokarzel</div>
                        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>Avenida Diogenes Ribeiro De Lima, 2170, Ap-184, São Paulo, SP</p>

                        <div style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
                            <div style={{ width: '8px', height: '8px', background: '#999', borderRadius: '50%' }}></div>
                            Pagamento via PIX expirado. (MOCK)
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <div className="summary-line">
                            <span>Total produto(s):</span>
                            <span>R$ 1.235,28</span>
                        </div>
                        <div className="summary-line">
                            <span>Serviços adicionais:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Frete:</span>
                            <span>R$ 7,90</span>
                        </div>
                        <div className="summary-line">
                            <span>Desconto:</span>
                            <span>- R$ 185,29</span>
                        </div>
                        <div className="summary-line">
                            <span>Crédito:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line">
                            <span>Doação:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <div className="summary-line total" style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                            <span>Total do pedido:</span>
                            <span>R$ 1.057,89</span>
                        </div>
                    </div>

                    <button className="btn-outline btn-outline-orange btn-block" style={{ textAlign: 'center', fontWeight: 'bold', borderWidth: '1px', textTransform: 'uppercase', fontSize: '0.85rem', padding: '12px' }}>
                        <i className="fas fa-chevron-left" style={{ marginRight: '5px' }}></i> VOLTAR AOS MEUS PEDIDOS
                    </button>
                </div>
            </div>
        </div>
    );
}
