"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

// Duplicated ProductCard for now to ensure self-containment/clean imports, 
// or ideally import the one from page.js if it was separated.
// Looking at page.js, HomeProductCard is local there. 
// Standard ProductCard is in app/components/ProductCard.js? Let's check imports.
// page.js defines HomeProductCard.
// We should use the standard ProductCard if possible, or move HomeProductCard to components.
// For now, let's assume we can pass a CardComponent or just use the standard one if it matches.
// Actually, let's check app/page.js again to see if HomeProductCard helps. 
// It seems HomeProductCard was created for "strict CSS structure".
// I will extract HomeProductCard to app/components/ProductCard.js (modifying or replacing the existing one if it's different)
// OR just define ProductSection to take children or mapping function.
// Simplest path: strict copy of ProductSection logic.

import ProductCard from "./ProductCard";
// Note: The one in page.js was "HomeProductCard". 
// Let's rely on the existing ProductCard in components which I previously edited.

export default function ProductSection({ title, linkHref, products, showLink = true }) {
    if (products.length === 0) return null;

    return (
        <section className="products-section" style={{ marginTop: '50px', marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>{title}</h2>
                {showLink && linkHref && (
                    <Link href={linkHref} className="btn-view-more">
                        Ver mais <ChevronRight size={16} />
                    </Link>
                )}
            </div>

            <div className="products-grid">
                {products.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
