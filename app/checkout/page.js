"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, QrCode, Ticket, MapPin, Check, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [method, setMethod] = useState('pix');
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Redirect if empty
    useEffect(() => {
        if (cartItems.length === 0) {
            // Optional: redirect home or just show empty state
        }
    }, [cartItems]);

    // Set valid address
    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            const priority = user.addresses.find(a => a.priority);
            setSelectedAddress(priority || user.addresses[0]);
        }
    }, [user]);

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#555' }}>Seu carrinho está vazio :(</h3>
                <p style={{ color: '#888', marginBottom: '30px' }}>Que tal dar uma olhada nas nossas novidades?</p>
                <Link href="/" className="btn-cta" style={{ display: 'inline-flex', padding: '12px 30px' }}>
                    Voltar para Loja
                </Link>
            </div>
        );
    }

    const shipping = 22.50;
    const discount = method === 'pix' ? cartTotal * 0.1 : 0;
    const finalTotal = cartTotal + shipping - discount;
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCheckout = () => {
        // Simulate API call/processing
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 500);
    };

    const handleCloseModal = () => {
        router.push('/');
    };

    return (
        <div className="checkout-container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', position: 'relative' }}>
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }} onClick={handleCloseModal}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        transform: 'scale(1)',
                        animation: 'pulse-scale 0.5s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#e8f5e9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: '#2e7d32'
                        }}>
                            <Check size={48} />
                        </div>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Pedido Realizado!</h2>
                        <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
                            Sua compra foi finalizada com sucesso.<br />
                            Fique de olho em <strong>Meus Pedidos</strong> para acompanhar o rastreio e cada etapa da entrega.
                        </p>
                        <button
                            onClick={handleCloseModal}
                            className="btn-cta"
                            style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '10px',
                                fontSize: '1rem'
                            }}
                        >
                            Voltar para Loja
                        </button>
                    </div>
                </div>
            )}

            <h1 className="checkout-title" style={{ marginBottom: '30px', fontSize: '2rem', color: '#1a1a1a', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                Finalizar Compra
            </h1>

            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '40px' }}>
                {/* Form Column */}
                <div className="checkout-form">

                    {/* Address Section */}
                    <div className="section-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#333' }}>
                            <MapPin size={22} color="var(--primary-orange)" />
                            Endereço de Entrega
                        </h3>

                        {selectedAddress ? (
                            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px', background: '#fafafa', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <span style={{ background: '#e0f2f1', color: '#00695c', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {selectedAddress.priority ? 'Principal' : 'Selecionado'}
                                    </span>
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', color: '#333' }}>{selectedAddress.name}</p>
                                <p style={{ color: '#555', marginBottom: '3px' }}>{selectedAddress.street}, {selectedAddress.number} {selectedAddress.comp && `- ${selectedAddress.comp}`}</p>
                                <p style={{ color: '#555' }}>{selectedAddress.city} - CEP: {selectedAddress.zip}</p>

                                <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', textAlign: 'right' }}>
                                    <Link href="/minha-conta/enderecos" style={{ color: 'var(--primary-orange)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        Trocar ou Editar Endereço &rarr;
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #ddd', borderRadius: '10px', background: '#fafafa' }}>
                                <AlertTriangle size={32} color="#f57c00" style={{ marginBottom: '10px' }} />
                                <p style={{ marginBottom: '15px', color: '#666' }}>Você não tem um endereço cadastrado.</p>
                                <Link href="/minha-conta/enderecos" className="btn-outline">
                                    Cadastrar Endereço
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className="section-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CreditCard size={22} color="var(--primary-orange)" />
                            Forma de Pagamento
                        </h3>

                        <div className="payment-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
                            <div
                                onClick={() => setMethod('pix')}
                                className={`payment-method-card ${method === 'pix' ? 'active' : ''}`}
                                style={{
                                    padding: '20px 10px',
                                    border: method === 'pix' ? '2px solid var(--primary-orange)' : '1px solid #ddd',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    background: method === 'pix' ? '#fff3e0' : 'white',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {method === 'pix' && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary-orange)', color: 'white', padding: '2px 6px', fontSize: '0.6rem', borderRadius: '0 0 0 6px' }}><Check size={10} /></div>}
                                <QrCode size={28} style={{ marginBottom: '10px', color: method === 'pix' ? 'var(--primary-orange)' : '#666' }} />
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#333' }}>Pix</div>
                                <div style={{ fontSize: '0.75rem', color: '#27ae60', fontWeight: 'bold', marginTop: '5px' }}>-10% OFF</div>
                            </div>

                            <div
                                onClick={() => setMethod('card')}
                                className={`payment-method-card ${method === 'card' ? 'active' : ''}`}
                                style={{
                                    padding: '20px 10px',
                                    border: method === 'card' ? '2px solid var(--primary-orange)' : '1px solid #ddd',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    background: method === 'card' ? '#fff3e0' : 'white',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                {method === 'card' && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary-orange)', color: 'white', padding: '2px 6px', fontSize: '0.6rem', borderRadius: '0 0 0 6px' }}><Check size={10} /></div>}
                                <CreditCard size={28} style={{ marginBottom: '10px', color: method === 'card' ? 'var(--primary-orange)' : '#666' }} />
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#333' }}>Cartão</div>
                                <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>Até 12x</div>
                            </div>

                            <div
                                onClick={() => setMethod('boleto')}
                                className={`payment-method-card ${method === 'boleto' ? 'active' : ''}`}
                                style={{
                                    padding: '20px 10px',
                                    border: method === 'boleto' ? '2px solid var(--primary-orange)' : '1px solid #ddd',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    background: method === 'boleto' ? '#fff3e0' : 'white',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                {method === 'boleto' && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary-orange)', color: 'white', padding: '2px 6px', fontSize: '0.6rem', borderRadius: '0 0 0 6px' }}><Check size={10} /></div>}
                                <Ticket size={28} style={{ marginBottom: '10px', color: method === 'boleto' ? 'var(--primary-orange)' : '#666' }} />
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#333' }}>Boleto</div>
                                <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>+ 3 dias</div>
                            </div>
                        </div>

                        {/* Details Area */}
                        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center', border: '1px solid #eee' }}>
                            {method === 'pix' && (
                                <div className="animate-fade-in">
                                    <div style={{ background: 'white', padding: '10px', display: 'inline-block', borderRadius: '8px', marginBottom: '15px' }}>
                                        <QrCode size={80} color="#333" />
                                    </div>
                                    <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Pagamento Instantâneo</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>O código Pix (Copia e Cola) será gerado na próxima etapa.</p>
                                </div>
                            )}
                            {method === 'card' && (
                                <div className="animate-fade-in">
                                    <p style={{ marginBottom: '15px' }}>Selecione um cartão salvo ou adicione um novo.</p>
                                    <button className="btn-outline" style={{ fontSize: '0.9rem' }}>Adicionar Novo Cartão</button>
                                </div>
                            )}
                            {method === 'boleto' && (
                                <div className="animate-fade-in">
                                    <Ticket size={48} style={{ margin: '0 auto 15px', color: '#757575' }} />
                                    <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Pagamento via Boleto Bancário</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Vencimento em 3 dias úteis. A aprovação pode levar até 48 horas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="checkout-summary-col">
                    <div className="summary-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '1.2rem', color: '#333', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' }}>
                            Resumo do Pedido
                        </h3>

                        <div className="cart-items-preview" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', marginBottom: '15px', gap: '10px' }}>
                                    <div style={{ width: '50px', height: '60px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.imagem} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', lineHeight: '1.2', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.nome}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#777' }}>Qtd: {item.qty}</div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                                        R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #f5f5f5', paddingTop: '20px' }}>
                            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                                <span>Frete</span>
                                <span>R$ {shipping.toFixed(2).replace('.', ',')}</span>
                            </div>
                            {method === 'pix' && (
                                <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0', color: '#27ae60', fontWeight: '500' }}>
                                    <span>Desconto Pix (-10%)</span>
                                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                                </div>
                            )}

                            <div className="total-final" style={{
                                marginTop: '20px',
                                paddingTop: '20px',
                                borderTop: '1px dashed #ddd',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Total</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-orange)', lineHeight: 1 }}>
                                        R$ {finalTotal.toFixed(2).replace('.', ',')}
                                    </div>
                                    {method === 'card' && <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>em até 12x sem juros</div>}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn-buy btn-block btn-pulse"
                            disabled={!selectedAddress}
                            style={{
                                width: '100%',
                                marginTop: '25px',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                opacity: !selectedAddress ? 0.7 : 1,
                                cursor: !selectedAddress ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>🔒</span> FINALIZAR PEDIDO
                        </button>

                        {!selectedAddress && (
                            <p style={{ color: '#e74c3c', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
                                Selecione um endereço para continuar
                            </p>
                        )}

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', color: '#aaa' }}>
                            <CreditCard size={20} />
                            <QrCode size={20} />
                            <Ticket size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


