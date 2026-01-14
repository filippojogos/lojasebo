import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma";
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'TEST-167855422731656-010418-8a531b1dbcd4c8081cad20038e6b84e0-139089034' });

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orderId = parseInt(params.id);

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
        }

        if (order.userId !== Number(session.user.id)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const items = JSON.parse(order.items || '[]');

        // Calculate shipping cost from total - sum of items
        // Or if we stored shipping separately? In schema we don't have separate shipping column yet?
        // Wait, checking schema... Order has `total`, `items`, `pagamento`, `status`. 
        // We don't have explicit shipping cost column in Order. 
        // But we need to pass shipments to MP or else it might look weird.
        // Actually, we can just pass a single item "Pedido #ID" with the full total to simplify, 
        // OR try to reconstruct.
        // Simplest and robust way for retry: One item "Pedido #123" with value = order.total.

        const preference = new Preference(client);

        const pref = await preference.create({
            body: {
                items: [
                    {
                        id: String(order.id),
                        title: `Pedido #${order.id} - Sebo Online`,
                        quantity: 1,
                        unit_price: Number(order.total),
                        currency_id: 'BRL'
                    }
                ],
                payer: {
                    email: session.user.email,
                    name: session.user.name,
                    surname: session.user.name && session.user.name.split(' ').length > 1 ? session.user.name.split(' ').slice(1).join(' ') : 'Sebo',
                },
                back_urls: {
                    success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success/${order.id}`,
                    failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/failure`,
                    pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/pending`
                },
                external_reference: String(order.id),
                auto_return: 'approved'
            }
        });

        return NextResponse.json({
            url: pref.sandbox_init_point // sandbox for now
        });

    } catch (error) {
        console.error("Retry Payment Error:", error);
        return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
    }
}
