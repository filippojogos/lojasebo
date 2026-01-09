import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const count = await prisma.banner.count();

        const newBanner = await prisma.banner.create({
            data: {
                ...data,
                order: count + 1,
                duration: data.duration || 5
            }
        });
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();

        if (Array.isArray(data)) {
            // Bulk update order
            // Transaction for safety
            await prisma.$transaction(
                data.map(b => prisma.banner.update({
                    where: { id: b.id },
                    data: { order: b.order }
                }))
            );
            return NextResponse.json({ message: 'Order updated' });
        }

        // Single Update
        const updated = await prisma.banner.update({
            where: { id: data.id },
            data: data
        });
        return NextResponse.json(updated);

    } catch (error) {
        console.error("Banner update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.banner.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
