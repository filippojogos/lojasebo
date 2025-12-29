"use client";

import React, { useState, useEffect, use } from 'react';
import ProductForm from '../../components/ProductForm';

export default function EditProductPage({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div>Carregando...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '30px' }}>Editar Produto #{id}</h1>
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
