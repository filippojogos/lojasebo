"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const filteredProducts = query
        ? products.filter(p =>
            p.nome.toLowerCase().includes(query.toLowerCase()) ||
            p.categoria.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--deep-purple)' }}>
                Resultados para: <span style={{ color: 'var(--primary-orange)' }}>&quot;{query}&quot;</span>
            </h1>

            {filteredProducts.length > 0 ? (
                <div className="products-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h2 style={{ color: '#666', marginBottom: '20px' }}>Nenhum produto encontrado :(</h2>
                    <p style={{ marginBottom: '30px' }}>Tente buscar por termos mais genéricos como &quot;Nintendo&quot; ou &quot;Livro&quot;.</p>
                    <Link href="/" className="btn-cta">
                        Voltar para a Loja
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Carregando busca...</div>}>
            <SearchContent />
        </Suspense>
    );
}
