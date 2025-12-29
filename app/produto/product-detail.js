"use client";

import React, { use, useState, useEffect } from "react";
import { getProductById } from "../data/products";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Link from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductPage({ params }) {
    const unwrappedParams = use(params);
    const product = getProductById(unwrappedParams.id);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart, cartItems, updateQuantity } = useCart();

    // Hooks must be unconditional, but we need product to init.
    // We'll use effects to sync.
    const [quantity, setQuantity] = useState(1);
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({});

    // Find if item is already in cart
    const cartItem = cartItems.find(item => item?.id === product?.id);
    const qtyInCart = cartItem ? cartItem.qty : 0;
    const stock = product?.estoque || 0;
    const images = product?.galeria && product.galeria.length > 0 ? product.galeria : (product?.imagem ? [product.imagem] : []);

    // Sync local quantity with cart ONLY on initial load or if cart changes externally?
    // User wants to edit it here.
    // Strategy: If in cart, init with cart qty.
    useEffect(() => {
        if (qtyInCart > 0) {
            setQuantity(qtyInCart);
        } else {
            setQuantity(1);
        }
    }, [qtyInCart]); // This might reset user input if they are typing? No, we use buttons.

    if (!product) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>Produto não encontrado!</div>;
    }

    const isWishlisted = isInWishlist(product.id);

    const handleIncrement = () => {
        if (quantity < stock) setQuantity(q => q + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleBuy = () => {
        if (qtyInCart > 0) {
            // Calculate difference to update
            const diff = quantity - qtyInCart;
            if (diff !== 0) {
                updateQuantity(product.id, diff);
            }
            // If diff is 0, maybe just open cart?
            // Since updateQuantity doesn't open cart (usually), we might want to ensure it opens.
            // But addToCart DOES open cart.
            // Let's manually trigger openCart if we can, or just trust the context.
            // Actually, updateQuantity in Context doesn't open Sidebar.
            // We'll assume the user perceives "Comprar" as "Confirm update".
            alert("Carrinho atualizado!");
        } else {
            addToCart(product, quantity);
        }
    };

    // Zoom Logic
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(2)",
            clipPath: "inset(0)" // keeps it inside
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: "center center",
            transform: "scale(1)"
        });
    };

    return (
        <div className="product-detail-container">
            <div className="breadcrumb">
                <Link href="/">Home</Link> /
                <span style={{ margin: '0 5px' }}>{product.categoria}</span> /
                <span style={{ color: '#999', margin: '0 5px' }}>{product.nome}</span>
            </div>

            <div className="product-detail-grid">
                {/* Left Col: Image Gallery */}
                <div className="detail-image-section">
                    <div
                        className="main-image-container"
                        style={{ overflow: 'hidden', position: 'relative', borderRadius: '8px', border: '1px solid #eee', background: 'white', cursor: 'crosshair' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img
                            src={images[activeImgIndex]}
                            alt={product.nome}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                transition: 'transform 0.1s ease-out',
                                ...zoomStyle
                            }}
                        />
                        {/* Hover hint */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', padding: '5px', borderRadius: '50%', pointerEvents: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </div>
                    </div>

                    {/* Thumbnails / Dots */}
                    {images.length > 1 && (
                        <div className="gallery-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                            <button
                                onClick={() => setActiveImgIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <ChevronLeft size={24} color="#666" />
                            </button>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImgIndex(idx)}
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: activeImgIndex === idx ? 'var(--deep-purple)' : '#ddd',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s'
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setActiveImgIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <ChevronRight size={24} color="#666" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Col: Info */}
                <div className="detail-info">
                    <h1 className="detail-title" style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
                        {product.nome}
                    </h1>

                    {/* Cleaned Info: No stars, just essential/rich info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                        <span className="detail-sku">SKU: {product.sku}</span>
                        <span>|</span>
                        <span>{product.categoria}</span>
                        <span>|</span>
                        <span>{product.subcategoria || 'Geral'}</span>
                    </div>

                    <div className="price-box" style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                        <span className="current-price" style={{ fontSize: '2.5rem', color: 'var(--deep-purple)', fontWeight: 'bold' }}>
                            R$ {product.preco.toFixed(2).replace('.', ',')}
                        </span>
                        <div style={{ color: '#28a745', fontWeight: '500', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>✓</span> Em estoque ({stock} unidades)
                        </div>
                    </div>

                    {/* Quantity Selector & Buy */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#333' }}>Quantidade</span>
                            {qtyInCart > 0 && <span style={{ color: 'var(--primary-orange)', fontSize: '0.9rem', fontWeight: 'bold' }}>{qtyInCart} já no carrinho</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <button
                                    onClick={handleDecrement}
                                    style={{ width: '50px', height: '50px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}
                                    disabled={quantity <= (qtyInCart > 0 ? 0 : 1)} // If in cart, allow going to 0? User said "tirar de la". If 0, we remove.
                                >-</button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    style={{ width: '60px', height: '50px', textAlign: 'center', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}
                                />
                                <button
                                    onClick={handleIncrement}
                                    style={{ width: '50px', height: '50px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}
                                    disabled={quantity >= stock}
                                >+</button>
                            </div>

                            <button
                                className="btn-buy"
                                style={{ flexGrow: 1, borderRadius: '8px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(255,101,0,0.3)' }}
                                onClick={handleBuy}
                            >
                                <ShoppingCart size={24} />
                                {qtyInCart > 0 ? (quantity === 0 ? "REMOVER DO CARRINHO" : "ATUALIZAR CARRINHO") : "COMPRAR AGORA"}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <button
                            onClick={() => toggleWishlist(product)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isWishlisted ? '#ff0055' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                textDecoration: 'underline'
                            }}
                        >
                            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            {isWishlisted ? "Remover da Lista de Desejos" : "Adicionar à Lista de Desejos"}
                        </button>
                    </div>

                    <div className="features" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1rem' }}>Sobre o produto</h3>
                        <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem' }}>
                            {product.descricao}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
