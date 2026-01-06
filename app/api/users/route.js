import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Fixed import

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { orders: true }
        });

        // Format for frontend
        const formatted = users.map(u => {
            // Helper to safe parse JSON
            const safeParse = (str) => { try { return JSON.parse(str); } catch { return null; } };
            const address = safeParse(u.endereco);

            // Calculate total spent from real orders
            const totalSpent = u.orders.reduce((acc, o) => acc + o.total, 0);

            return {
                id: u.id,
                nome: u.nome,
                email: u.email,
                cpf: u.cpf || 'N/A',
                telefone: u.telefone || 'N/A',
                endereco_principal: address ? `${address.cidade}/${address.uf}` : 'N/A',
                total_gasto: totalSpent,
                data_cadastro: u.createdAt
            };
        });

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("Users GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // Delete related orders first? checking constraints. 
        // Prisma usually handles cascade if configured, but let's be safe or assume cascade delete in schema (not set).
        // For now, we delete user and let prisma complain if orders exist, OR we delete orders first.

        // Let's delete orders for this user first manually to be safe
        await prisma.order.deleteMany({ where: { userId: Number(id) } });

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("User DELETE Error:", e);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
