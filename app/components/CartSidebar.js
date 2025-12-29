"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2 } from 'lucide-react';

export default function CartSidebar() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        removeFromCart,
        cartTotal
    } = useCart();
    const { user } = useAuth();

    // if (!isCartOpen) return null; -> Removed to allow CSS transition

    const router = useRouter();

    const handleNavigation = (path) => {
        closeCart();

        // If trying to go to checkout and not logged in
        if (path === '/checkout' && !user) {
            router.push('/login?redirect=/checkout');
            return;
        }

        router.push(path);
    };

    return (
        <>
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={closeCart}></div>
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Meu Carrinho</h3>
                    <button className="close-cart" onClick={closeCart}>
                        <X size={24} />
                    </button>
                </div>

                <div className="sidebar-content">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-msg" style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
                            Seu carrinho está vazio :(
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <div style={{ width: '60px', height: '60px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                                    <img src={item.imagem} alt={item.nome} style={{ height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                </div>
                                <div className="cart-item-info" style={{ flex: 1 }}>
                                    <h4>{item.nome}</h4>
                                    <div className="cart-item-price">
                                        R$ {item.price.toFixed(2).replace('.', ',')} x {item.qty}
                                    </div>
                                    <small
                                        style={{ color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 size={12} /> Remover
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="sidebar-footer">
                    <div className="total-row">
                        <span>Total:</span>
                        <span className="cart-total-value">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            className="btn-outline btn-block"
                            style={{ textAlign: 'center', textDecoration: 'none', width: '100%', padding: '10px', fontSize: '1rem', cursor: 'pointer' }}
                            onClick={() => handleNavigation('/carrinho')}
                        >
                            Ver Meu Carrinho
                        </button>
                        <button
                            className="btn-cta btn-block"
                            style={{ textAlign: 'center', textDecoration: 'none', width: '100%', padding: '10px', fontSize: '1rem', cursor: 'pointer', border: 'none' }}
                            onClick={() => handleNavigation('/checkout')}
                        >
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
