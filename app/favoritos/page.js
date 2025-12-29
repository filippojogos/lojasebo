"use client";

import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 className="section-title">
                    <Heart size={32} color="#ff6500" fill="#ff6500" style={{ marginRight: '10px' }} />
                    Meus Favoritos
                </h1>
            </div>

            {wishlist.length > 0 ? (
                <div className="products-grid">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '80px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: 'var(--card-shadow)',
                    border: '1px dashed #ccc'
                }}>
                    <Heart size={64} color="#ccc" style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '10px' }}>Sua lista está vazia</h2>
                    <p style={{ color: '#999', marginBottom: '30px' }}>Salve itens que você ama para ver aqui depois.</p>
                    <Link href="/" className="btn-cta">
                        Explorar Produtos
                    </Link>
                </div>
            )}
        </div>
    );
}
