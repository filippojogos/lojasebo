"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShoppingCart, Heart } from 'lucide-react';
// import { getProducts } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';
import ProductSection from '../../components/ProductSection';
import ProductCard from '../../components/ProductCard';

export default function CategoryPage({ params }) {
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');

    useEffect(() => {
        const fetchProductsAndFilter = async () => {
            try {
                // Fetch fresh data from API (which reads the JSON updated by Admin)
                const res = await fetch('/api/products');
                const allProducts = await res.json();

                const slugs = params.slug;
                const mainCatSlug = slugs[0];
                const subCatSlug = slugs[1];

                // Map for cleaner titles
                const CATEGORY_MAP = {
                    'livros': 'Livros',
                    'dvds-blu-ray': 'DVDs & Blu-Ray',
                    'cds-de-musica': 'CDs de Música',
                    'video-game': 'Video Game',
                    'hqs-mangas': 'HQs & Mangás',
                    'card-game': 'Card Game',
                    'vhs': 'VHS'
                };

                const normalize = (str) => {
                    if (!str) return '';
                    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
                };

                const filtered = allProducts.filter(p => {
                    const pCat = normalize(p.categoria);
                    const sCat = normalize(mainCatSlug);

                    if (pCat !== sCat) return false;

                    if (subCatSlug) {
                        const pSub = normalize(p.subcategoria);
                        const sSub = normalize(subCatSlug);
                        return pSub === sSub;
                    }

                    return true;
                });

                setProducts(filtered);

                // Set display names
                const cleanTitle = CATEGORY_MAP[mainCatSlug] || mainCatSlug.replace(/-/g, ' ').toUpperCase();
                setCategoryName(cleanTitle);

                if (subCatSlug) {
                    setSubCategoryName(subCatSlug.replace(/-/g, ' ').toUpperCase());
                }

            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProductsAndFilter();
    }, [params.slug]);

    const isVideoGameRoot = params.slug?.[0] === 'video-game' && !params.slug?.[1];
    const isCardGameRoot = params.slug?.[0] === 'card-game' && !params.slug?.[1];

    // Video Game Specific Data
    const getHighlightsGames = () => products.filter(p => (p.tag === 'Oferta' || p.tag === 'Destaque' || p.tag === 'Novo') && p.categoria === 'Video Game').slice(0, 4);
    const getNintendo = () => products.filter(p => p.subcategoria === 'Nintendo');
    const getXbox = () => products.filter(p => p.subcategoria === 'Xbox');
    const getSony = () => products.filter(p => p.subcategoria === 'Sony');
    const getSega = () => products.filter(p => p.subcategoria === 'Sega');
    const getPc = () => products.filter(p => p.subcategoria === 'PC');

    // Card Game Specific Data
    const getHighlightsCards = () => products.filter(p => (['Oferta', 'Destaque', 'Novo', 'Ultra Raro', 'Icone', 'Réplica'].includes(p.tag)) && p.categoria === 'Card Game').slice(0, 4);
    const getPokemon = () => products.filter(p => p.subcategoria === 'Pokemon TCG');
    const getYugioh = () => products.filter(p => p.subcategoria === 'Yu-Gi-Oh!');
    const getMagic = () => products.filter(p => p.subcategoria === 'Magic');

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span style={{ margin: '0 10px' }}><ChevronRight size={14} /></span>
                <span style={{ color: 'var(--primary-orange)', fontWeight: 'bold' }}>{categoryName}</span>
                {subCategoryName && (
                    <>
                        <span style={{ margin: '0 10px' }}><ChevronRight size={14} /></span>
                        <span style={{ fontWeight: 'bold' }}>{subCategoryName}</span>
                    </>
                )}
            </div>

            <h1 className="section-title">
                {subCategoryName ? `${categoryName}: ${subCategoryName}` : categoryName}
            </h1>

            {/* Specialized Video Game Layout */
                isVideoGameRoot ? (
                    <>
                        <ProductSection title="Nintendo" products={getNintendo()} linkHref="/categoria/video-game/nintendo" />
                        <ProductSection title="Xbox" products={getXbox()} linkHref="/categoria/video-game/xbox" />
                        <ProductSection title="Sony" products={getSony()} linkHref="/categoria/video-game/sony" />
                        <ProductSection title="Sega" products={getSega()} linkHref="/categoria/video-game/sega" />
                        <ProductSection title="PC Games" products={getPc()} linkHref="/categoria/video-game/pc" />
                    </>
                ) : isCardGameRoot ? (
                    /* Specialized Card Game Layout */
                    <>
                        <ProductSection title="Pokemon TCG" products={getPokemon()} linkHref="/categoria/card-game/pokemon-tcg" />
                        <ProductSection title="Yu-Gi-Oh!" products={getYugioh()} linkHref="/categoria/card-game/yu-gi-oh" />
                        <ProductSection title="Magic" products={getMagic()} linkHref="/categoria/card-game/magic" />
                    </>
                ) : (
                    /* Standard Grid Layout */
                    products.length > 0 ? (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '60px',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: 'var(--card-shadow)'
                        }}>
                            <h2 style={{ color: '#666', marginBottom: '10px' }}>Nenhum produto encontrado</h2>
                            <p style={{ color: '#999' }}>Desculpe, ainda não temos itens nesta categoria.</p>
                            <Link href="/" className="btn-cta" style={{ marginTop: '20px', display: 'inline-block' }}>
                                Voltar para a Loja
                            </Link>
                        </div>
                    )
                )}
        </div>
    );
}
