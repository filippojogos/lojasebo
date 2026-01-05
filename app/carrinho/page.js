"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import Auth
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight, LogIn } from 'lucide-react';

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount
    } = useCart();
    const { user } = useAuth(); // Hook de Auth

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '16px' }}>
                    <ShoppingCart size={64} color="#ddd" style={{ marginBottom: '20px' }} />
                    <h2 style={{ color: '#666', marginBottom: '10px' }}>Seu carrinho está vazio</h2>
                    <p style={{ color: '#999', marginBottom: '30px' }}>Parece que você ainda não adicionou nenhum item.</p>
                    <Link href="/" className="btn-cta">
                        Voltar para a Loja
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--deep-purple)' }}>Meu Carrinho</h1>

            <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px', alignItems: 'start' }}>
                {/* Items List */}
                <div className="cart-items-list" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

                    <div className="cart-header" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '15px 20px', background: '#f5f5f5', fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>
                        <span>Produto</span>
                        <span style={{ textAlign: 'center' }}>Qtd</span>
                        <span style={{ textAlign: 'right' }}>Preço</span>
                        <span style={{ textAlign: 'right' }}>Subtotal</span>
                    </div>

                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item-row" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '20px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                            {/* Product Info */}
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Link href={`/produto/${item.id}`} style={{ display: 'block', width: '60px', height: '60px', background: '#f9f9f9', borderRadius: '4px', flexShrink: 0 }}>
                                    <img src={item.imagem} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                </Link>
                                <div>
                                    <Link href={`/produto/${item.id}`} style={{ fontWeight: '500', color: '#333', marginBottom: '5px', display: 'block', textDecoration: 'none' }}>
                                        {item.nome}
                                    </Link>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                    >
                                        <Trash2 size={12} /> Remover
                                    </button>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    disabled={item.qty <= 1}
                                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: item.qty <= 1 ? '#f5f5f5' : 'white', cursor: item.qty <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.qty <= 1 ? '#ccc' : '#333' }}
                                >-</button>
                                <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    disabled={item.qty >= (item.estoque || 99)}
                                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: item.qty >= (item.estoque || 99) ? '#f5f5f5' : 'white', cursor: item.qty >= (item.estoque || 99) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.qty >= (item.estoque || 99) ? '#ccc' : '#333' }}
                                >+</button>
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: 'right', color: '#666' }}>
                                R$ {item.price.toFixed(2).replace('.', ',')}
                            </div>

                            {/* Subtotal */}
                            <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-orange)' }}>
                                R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Box */}
                <div className="cart-summary" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Resumo</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#666' }}>Soma dos produtos</span>
                        <strong>R$ {cartTotal.toFixed(2).replace('.', ',')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '1.2rem', color: 'var(--text-dark)' }}>
                        <strong>Total</strong>
                        <strong style={{ color: 'var(--primary-orange)' }}>R$ {cartTotal.toFixed(2).replace('.', ',')}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {user ? (
                            <Link href="/checkout" className="btn-cta btn-block" style={{ textAlign: 'center', padding: '15px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                Finalizar Compra <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <Link href="/login?redirect=/checkout" className="btn-cta btn-block" style={{ textAlign: 'center', padding: '15px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'var(--deep-purple)' }}>
                                <LogIn size={18} /> Fazer Login para Comprar
                            </Link>
                        )}

                        <Link href="/" className="btn-outline btn-block" style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <ArrowLeft size={18} /> Voltar para Loja
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
