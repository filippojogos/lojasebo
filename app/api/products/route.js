
import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '../../lib/productUtils';

export async function GET() {
    const products = getProducts();
    return NextResponse.json(products);
}

export async function POST(request) {
    try {
        const products = getProducts();
        const newProduct = await request.json();

        // Generate simple ID (max id + 1)
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        newProduct.id = maxId + 1;

        products.push(newProduct);
        saveProducts(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
