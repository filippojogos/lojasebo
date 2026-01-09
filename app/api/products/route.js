
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany();

        // Parse JSON strings back to objects for frontend compatibility
        const formattedProducts = products.map(p => ({
            ...p,
            galeria: p.galeria ? JSON.parse(p.galeria) : [],
            // If other JSON fields exist, parse them here
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Remove id if present to let auto-increment handle it
        const { id, ...createData } = data;

        // Ensure galeria is a string
        if (createData.galeria && typeof createData.galeria !== 'string') {
            createData.galeria = JSON.stringify(createData.galeria);
        } else if (!createData.galeria) {
            createData.galeria = '[]';
        }

        const newProduct = await prisma.product.create({
            data: createData,
        });

        // Return with parsed galeria
        return NextResponse.json({
            ...newProduct,
            galeria: JSON.parse(newProduct.galeria)
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
