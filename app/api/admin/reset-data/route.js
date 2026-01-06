
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import path if needed

export async function POST(req) {
    try {
        // Authenticate (Basic implementation - IRL use session)
        // For now, relies on being called from admin context

        // Delete in order to respect foreign keys
        // 1. OrderItems (depend on Orders and Products) - Cascade usually handles this if configured, but let's be explicit
        // 2. Orders (depend on Users)
        // 3. Users (clientes)

        // We do NOT delete Products as requested (user wants to keep products)
        // We do NOT delete legacy Admin data if any (but we use cookies so ok)

        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.user.deleteMany({
            where: {
                role: { not: 'ADMIN' } // Keep admins if stored in DB
            }
        });

        // Optional: Reset User IDs sequence if Postgres? No, too complex/risky.

        return NextResponse.json({ success: true, message: 'Dados limpos com sucesso' });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ error: 'Falha ao limpar dados' }, { status: 500 });
    }
}
