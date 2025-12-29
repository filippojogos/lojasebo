
import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '../../../lib/productUtils';

export async function GET(request, { params }) {
    const { id } = await params;
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const products = getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updates = await request.json();
        products[index] = { ...products[index], ...updates };

        saveProducts(products);

        return NextResponse.json(products[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        let products = getProducts();
        const initialLength = products.length;

        products = products.filter(p => p.id !== parseInt(id));

        if (products.length === initialLength) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        saveProducts(products);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
