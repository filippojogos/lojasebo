"use client";

import React from 'react';
import ProductForm from '../../components/ProductForm';

export default function NewProductPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '30px' }}>Adicionar Novo Produto</h1>
            <ProductForm />
        </div>
    );
}
