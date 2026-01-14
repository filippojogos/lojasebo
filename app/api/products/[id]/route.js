
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Parse galeria
        const formattedProduct = {
            ...product,
            galeria: product.galeria ? JSON.parse(product.galeria) : []
        };

        return NextResponse.json(formattedProduct);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const updates = await request.json();

        // Handle galeria serialization if it's being updated
        if (updates.galeria && typeof updates.galeria !== 'string') {
            updates.galeria = JSON.stringify(updates.galeria);
        }

        // Remove id from updates if present (shouldn't change ID)
        delete updates.id;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updates
        });

        return NextResponse.json({
            ...updatedProduct,
            galeria: JSON.parse(updatedProduct.galeria)
        });
    } catch (error) {
        console.error("Error updating product:", error);
        // Check for record not found
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({
            error: 'Failed to update',
            details: error.message,
            code: error.code,
            meta: error.meta
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
