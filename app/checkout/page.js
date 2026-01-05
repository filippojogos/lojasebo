"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, QrCode, Ticket, MapPin, Check, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [method, setMethod] = useState('pix');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, loading, router]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [shippingOption, setShippingOption] = useState(null); // { name: 'PAC', price: 20, days: 5 }
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingError, setShippingError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Pix Data State
    const [pixData, setPixData] = useState(null);

    // Initial Address Selection
    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            const priority = user.addresses.find(a => a.priority);
            setSelectedAddress(priority || user.addresses[0]);
        }
    }, [user]);

    // Calculate Shipping when Address Changes
    useEffect(() => {
        if (selectedAddress?.zip && cartItems.length > 0) {
            calculateShipping(selectedAddress.zip);
        }
    }, [selectedAddress, cartItems.length]);

    const calculateShipping = async (zip) => {
        setLoadingShipping(true);
        setShippingError('');
        setShippingOptions([]);
        setShippingOption(null);

        try {
            const res = await fetch('/api/shipping/calc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destCep: zip,
                    products: cartItems
                })
            });

            if (!res.ok) throw new Error('Erro no cálculo');

            const data = await res.json();
            const options = Array.isArray(data) ? data : (data.content || []);

            const formattedOptions = options.map(opt => ({
                name: opt.name || opt.service || 'Entrega',
                price: Number(opt.price || opt.cost || 0),
                days: Number(opt.delivery_time || opt.days || 7),
                company: opt.company?.name || 'Correios'
            })).sort((a, b) => a.price - b.price);

            if (formattedOptions.length === 0) {
                setShippingOptions([
                    { name: 'PAC', price: 22.50, days: 7, company: 'Correios' },
                    { name: 'SEDEX', price: 35.00, days: 2, company: 'Correios' }
                ]);
                setShippingOption({ name: 'PAC', price: 22.50, days: 7, company: 'Correios' });
            } else {
                setShippingOptions(formattedOptions);
                setShippingOption(formattedOptions[0]);
            }

        } catch (err) {
            console.error(err);
            setShippingError('Não foi possível calcular o frete para este CEP.');
            setShippingOptions([
                { name: 'PAC', price: 22.50, days: 7, company: 'Correios' },
                { name: 'SEDEX', price: 35.00, days: 2, company: 'Correios' }
            ]);
            setShippingOption({ name: 'PAC', price: 22.50, days: 7, company: 'Correios' });
        } finally {
            setLoadingShipping(false);
        }
    };

    const shippingCost = shippingOption?.price || 0;
    const discount = method === 'pix' ? cartTotal * 0.1 : 0;
    const finalTotal = cartTotal + shippingCost - discount;

    const handleCheckout = async () => {
        if (!user || !selectedAddress || !shippingOption) return;
        setIsProcessing(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    total: finalTotal,
                    shipping: shippingCost,
                    address: selectedAddress,
                    paymentMethod: method
                })
            });

            const data = await res.json();

            if (res.ok) {
                clearCart();

                if (data.payment?.type === 'redirect') {
                    window.location.href = data.payment.url;
                } else if (data.payment?.type === 'pix') {
                    setPixData(data.payment);
                    setShowSuccessModal(true);
                } else {
                    setShowSuccessModal(true);
                }
            } else {
                alert("Erro ao criar pedido: " + (data.error || "Tente novamente."));
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseModal = () => {
        router.push('/');
    };

    const copyToClipboard = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code);
            alert("Código Pix copiado!");
        }
    };

    if (!isMounted || loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Carregando...</div>;

    if (!user) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px', gap: '20px' }}>
                <h2>Necessário Fazer Login</h2>
                <Link href="/login?redirect=/checkout" className="btn-cta">Fazer Login</Link>
            </div>
        );
    }

    if (cartItems.length === 0 && !showSuccessModal) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#555' }}>Seu carrinho está vazio :(</h3>
                <Link href="/" className="btn-cta" style={{ display: 'inline-flex', padding: '12px 30px' }}>Voltar para Loja</Link>
            </div>
        );
    }

    return (
        <div className="checkout-container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            {showSuccessModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ width: '80px', height: '80px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#2e7d32' }}>
                            <Check size={48} />
                        </div>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Pedido Realizado!</h2>

                        {pixData ? (
                            <div style={{ marginTop: '20px', marginBottom: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '15px' }}>Pagamento via Pix</h4>
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Escaneie o QR Code ou copie o código abaixo:</p>

                                {pixData.qr_code_base64 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                        <img
                                            src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                            alt="QR Code Pix"
                                            style={{ width: '200px', height: '200px' }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={pixData.qr_code}
                                        readOnly
                                        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.8rem', background: 'white' }}
                                    />
                                    <button onClick={copyToClipboard} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Copy size={16} /> Copiar
                                    </button>
                                </div>
                                <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#999' }}>O pagamento deve ser feito em até 30 minutos.</p>
                            </div>
                        ) : (
                            <p style={{ color: '#666', marginBottom: '25px' }}>Sua compra foi finalizada com sucesso. Acompanhe o status no seu email.</p>
                        )}

                        <button onClick={handleCloseModal} className="btn-cta" style={{ width: '100%' }}>Voltar para Loja</button>
                    </div>
                </div>
            )}

            <h1 style={{ marginBottom: '30px', fontSize: '2rem', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>Finalizar Compra</h1>

            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '40px' }}>
                <div className="checkout-form">
                    {/* 1. Endereço */}
                    <div className="section-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                            <MapPin size={22} color="var(--primary-orange)" /> Endereço de Entrega
                        </h3>
                        {selectedAddress ? (
                            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px', background: '#fafafa', position: 'relative' }}>
                                <p style={{ fontWeight: 'bold' }}>{selectedAddress.name}</p>
                                <p>{selectedAddress.street}, {selectedAddress.number} - {selectedAddress.comp}</p>
                                <p>{selectedAddress.city} - CEP: {selectedAddress.zip}</p>
                                <Link href="/minha-conta/enderecos" style={{ display: 'block', marginTop: '10px', color: 'var(--primary-orange)', fontWeight: 'bold' }}>Trocar Endereço</Link>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <AlertTriangle color="orange" size={32} />
                                <p style={{ marginBottom: '0' }}>Cadastre um endereço para calcular o frete.</p>
                                <Link href="/minha-conta/enderecos?from=checkout" className="btn-outline" style={{ marginTop: '5px' }}>Cadastrar Endereço</Link>
                            </div>
                        )}
                    </div>

                    {/* 2. Opções de Frete */}
                    {selectedAddress && (
                        <div className="section-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>🚚 Método de Envio</h3>
                            {loadingShipping ? (
                                <p>Calculando frete...</p>
                            ) : shippingOptions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {shippingOptions.map((opt, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'center', padding: '15px', border: shippingOption?.name === opt.name ? '2px solid var(--primary-orange)' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: shippingOption?.name === opt.name ? '#fff8f0' : 'white' }}>
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={shippingOption?.name === opt.name}
                                                onChange={() => setShippingOption(opt)}
                                                style={{ marginRight: '15px' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontWeight: 'bold' }}>{opt.name}</span> ({opt.company})
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>Chega em até {opt.days} dias úteis</div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                                                R$ {opt.price.toFixed(2).replace('.', ',')}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p>{shippingError || "Aguardando cálculo..."}</p>
                            )}
                        </div>
                    )}

                    {/* 3. Pagamento */}
                    <div className="section-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                            <CreditCard size={22} color="var(--primary-orange)" /> Pagamento
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <div onClick={() => setMethod('pix')} className={`payment-method-card ${method === 'pix' ? 'active' : ''}`} style={{ flex: 1, padding: '15px', border: method === 'pix' ? '2px solid var(--primary-orange)' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                <QrCode size={24} style={{ marginBottom: '5px' }} />
                                <div>Pix (-10%)</div>
                            </div>
                            <div onClick={() => setMethod('card')} className={`payment-method-card ${method === 'card' ? 'active' : ''}`} style={{ flex: 1, padding: '15px', border: method === 'card' ? '2px solid var(--primary-orange)' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                <CreditCard size={24} style={{ marginBottom: '5px' }} />
                                <div>Cartão</div>
                            </div>
                            <div onClick={() => setMethod('boleto')} className={`payment-method-card ${method === 'boleto' ? 'active' : ''}`} style={{ flex: 1, padding: '15px', border: method === 'boleto' ? '2px solid var(--primary-orange)' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                <Ticket size={24} style={{ marginBottom: '5px' }} />
                                <div>Boleto</div>
                            </div>
                        </div>
                        {method === 'pix' && <p style={{ fontSize: '0.9rem', color: '#666' }}>O código Pix será gerado na próxima tela.</p>}
                        {method !== 'pix' && <p style={{ fontSize: '0.9rem', color: '#666' }}>Você será redirecionado para o Mercado Pago para concluir o pagamento.</p>}
                    </div>
                </div>

                <div className="checkout-summary-col">
                    <div className="summary-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Resumo</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Subtotal</span>
                            <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Frete</span>
                            <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {method === 'pix' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'green' }}>
                                <span>Desconto Pix</span>
                                <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-orange)' }}>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={!selectedAddress || !shippingOption || isProcessing}
                            className="btn-cta btn-block"
                            style={{ marginTop: '25px', opacity: (!selectedAddress || !shippingOption || isProcessing) ? 0.6 : 1, cursor: (!selectedAddress || !shippingOption) ? 'not-allowed' : 'pointer' }}
                        >
                            {isProcessing ? 'Processando...' : 'FINALIZAR PEDIDO'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
