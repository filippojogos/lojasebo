"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, className = "" }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const router = useRouter();
    const isWishlisted = isInWishlist(product.id);

    // Find if item is already in cart
    const cartItem = cartItems.find(item => item.id === product.id);
    const qtyInCart = cartItem ? cartItem.qty : 0;
    const stock = product.estoque || 0;

    const handleIncrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (qtyInCart < stock) {
            updateQuantity(product.id, 1);
        }
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, -1);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const handleCardClick = (e) => {
        // Only navigate if we're not clicking a control
        router.push(`/produto/${product.id}`);
    };

    return (
        <div className={`product-card ${className}`}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            <div
                className="product-image-link"
                style={{ display: 'block', flexGrow: 1, cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <div className="product-image">
                    <img src={product.imagem} alt={product.nome} style={{ height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </div>
            </div>

            <div
                className="product-info-link"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <h2 className="product-title">
                    {product.nome}
                </h2>

                <div className="product-prices" style={{ display: 'flex', justifyContent: 'center' }}>
                    <span className="product-price">
                        R$ {product.preco.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>

            {qtyInCart > 0 ? (
                <div className="qty-controls" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', background: '#f5f5f5', borderRadius: '4px', padding: '5px' }}>
                    <button
                        onClick={handleDecrement}
                        style={{ width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                    >-</button>
                    <span style={{ fontWeight: 'bold', margin: '0 10px' }}>{qtyInCart}</span>
                    <button
                        onClick={handleIncrement}
                        disabled={qtyInCart >= stock}
                        style={{ width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', background: qtyInCart >= stock ? '#eee' : 'white', cursor: qtyInCart >= stock ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: qtyInCart >= stock ? '#aaa' : 'inherit' }}
                    >+</button>
                </div>
            ) : (
                <button
                    className="btn-buy"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={16} />
                    COMPRAR
                </button>
            )}
        </div>
    );
}
