
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../lib/prisma";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// MP Configuration
// TODO: Replace with env variable process.env.MP_ACCESS_TOKEN
const client = new MercadoPagoConfig({ accessToken: 'TEST-5396516642732009-092213-983df5a676c533a067605963b6038459-166296068' });

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: Number(session.user.id) },
            orderBy: { data: 'desc' }
        });

        const formattedOrders = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items || '[]')
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, total, shipping, address, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        const estimatedProfit = total * 0.3;

        // 1. Create Order in Database
        const newOrder = await prisma.order.create({
            data: {
                userId: Number(session.user.id),
                total: parseFloat(total),
                lucro: estimatedProfit,
                status: 'pendente_pagamento',
                pagamento: paymentMethod,
                items: JSON.stringify(items),
            }
        });

        let paymentResponse = null;

        // 2. Handle Payment Gateway
        if (paymentMethod === 'pix') {
            const payment = new Payment(client);
            try {
                const payData = await payment.create({
                    body: {
                        transaction_amount: parseFloat(total),
                        description: `Pedido #${newOrder.id} - Sebo Online`,
                        payment_method_id: 'pix',
                        payer: {
                            email: session.user.email,
                            first_name: session.user.name ? session.user.name.split(' ')[0] : 'Cliente',
                            last_name: session.user.name && session.user.name.split(' ').length > 1 ? session.user.name.split(' ').slice(1).join(' ') : 'Sebo',
                            entity_type: 'individual',
                            identification: {
                                type: 'CPF',
                                number: '19119119100' // Mock CPF as we don't request it yet from user
                            }
                        },
                        notification_url: 'https://sebo-online.vercel.app/api/webhooks/mp'
                    }
                });

                paymentResponse = {
                    type: 'pix',
                    qr_code: payData.point_of_interaction.transaction_data.qr_code,
                    qr_code_base64: payData.point_of_interaction.transaction_data.qr_code_base64,
                    ticket_url: payData.point_of_interaction.transaction_data.ticket_url,
                    payment_id: payData.id
                };

            } catch (mpError) {
                console.error("MP Pix Error:", mpError);
                // We return the order anyway, but with error
            }

        } else if (paymentMethod === 'card' || paymentMethod === 'boleto') {
            const preference = new Preference(client);
            try {
                const pref = await preference.create({
                    body: {
                        items: items.map(item => ({
                            id: String(item.id),
                            title: item.nome,
                            quantity: Number(item.qty),
                            unit_price: Number(item.price)
                        })),
                        shipments: {
                            cost: Number(shipping),
                            mode: 'not_specified'
                        },
                        payer: {
                            email: session.user.email,
                            name: session.user.name
                        },
                        back_urls: {
                            success: `https://sebo-online.vercel.app/checkout/success`,
                            failure: `https://sebo-online.vercel.app/checkout/failure`,
                            pending: `https://sebo-online.vercel.app/checkout/pending`
                        },
                        auto_return: 'approved',
                        external_reference: String(newOrder.id)
                    }
                });

                paymentResponse = {
                    type: 'redirect',
                    url: pref.init_point
                };
            } catch (mpError) {
                console.error("MP Preference Error:", mpError);
            }
        }

        return NextResponse.json({
            order: newOrder,
            payment: paymentResponse
        });

    } catch (error) {
        console.error("Order Create Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
