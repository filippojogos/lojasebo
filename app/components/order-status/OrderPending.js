
import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function OrderPending({ order }) {
    return (
        <div className="order-details-wrapper">
            {/* Title with Orange Pipe - Added for consistency */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ width: '5px', height: '30px', background: 'var(--primary-orange)', marginRight: '15px' }}></div>
                <h1 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Detalhes do Pedido #{order.id}</h1>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-block', background: '#fff8e1', color: '#f57f17', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', border: '2px solid #ffecb3', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} /> Aguardando Pagamento
                </div>
                <h1 style={{ marginTop: '20px', fontSize: '2rem' }}>Quase lá! Só falta o pagamento.</h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Seu pedido <strong>#{order.id}</strong> foi reservado e aguarda a confirmação do pagamento.</p>
            </div>

            <div className="checkout-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Instructions Column */}
                <div className="form-section" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div id="payment-instructions-area">
                        {/* Mock Pix Content */}
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--deep-purple)', marginBottom: '20px' }}>Pagamento via Pix</h3>
                            <div style={{ background: 'white', padding: '20px', display: 'inline-block', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '20px' }}>
                                <img src="https://via.placeholder.com/200x200?text=QR+Code" alt="Pix QR Code" style={{ width: '200px', height: '200px' }} />
                            </div>
                            <p style={{ marginBottom: '10px' }}>Escaneie o QR Code acima ou copie o código abaixo:</p>
                            <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '15px', border: '1px dashed #ccc' }}>
                                00020126580014BR.GOV.BCB.PIX0114+55119999999995204000053039865802BR5913LOJA SEBO6009SAO PAULO62070503***6304E2D2
                            </div>
                            <button className="btn-outline btn-sm" onClick={() => alert('Código Copiado! ✨')}>Copiar Código Pix</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#666' }}>
                        <p><strong>Importante:</strong></p>
                        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                            <li>O prazo para pagamento é de 30 minutos. Após isso, o pedido será cancelado automaticamente.</li>
                            <li>Seus itens estão reservados até o vencimento.</li>
                            <li>A confirmação do Pix é instantânea. O Boleto pode levar até 2 dias úteis.</li>
                        </ul>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="checkout-summary" style={{ height: 'fit-content' }}>
                    <h3>Resumo do Pedido</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <span>1x O Senhor dos Anéis</span>
                        <span>R$ 329,80</span>
                    </div>

                    <div className="summary-totals" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #eee' }}>
                        <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Subtotal</span>
                            <span>R$ 329,80</span>
                        </div>
                        <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Frete</span>
                            <span>R$ 22,50</span>
                        </div>
                        <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#27ae60' }}>
                            <span>Desconto (10% Pix)</span>
                            <span>- R$ 32,98</span>
                        </div>
                        <div className="total-row total-final" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total (Pix)</span>
                            <span>R$ 319,32</span>
                        </div>
                    </div>
                    <Link href="/minha-conta/pedidos" className="btn-outline btn-outline-orange btn-block" style={{ textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', borderWidth: '1px', textTransform: 'uppercase', fontSize: '0.85rem', padding: '12px', display: 'block', marginTop: '20px' }}>
                        <i className="fas fa-chevron-left" style={{ marginRight: '5px' }}></i> VOLTAR AOS MEUS PEDIDOS
                    </Link>
                </div>
            </div>
        </div>
    );
}
