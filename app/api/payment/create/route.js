
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize Mercado Pago
// NOTE: Ideally use process.env.MERCADO_PAGO_ACCESS_TOKEN, but falling back to the known test token if env fails for now to ensure it works.
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-167855422731656-010418-8a531b1dbcd4c8081cad20038e6b84e0-139089034';
const client = new MercadoPagoConfig({ accessToken });

export async function POST(req) {
    try {
        const body = await req.json();
        const { items, payer } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Itens são obrigatórios' }, { status: 400 });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    id: String(item.id),
                    title: item.title,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'BRL'
                })),
                payer: {
                    email: payer?.email || 'test_user_123456@testuser.com', // Sandbox requires test user or valid email
                    // Add other payer info if available
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/sucesso`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/erro`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/pendente`
                },
                auto_return: 'approved'
            }
        });

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point, // For production
            sandbox_init_point: result.sandbox_init_point // For testing
        });

    } catch (error) {
        console.error("Mercado Pago Error:", error);
        return NextResponse.json({ error: 'Falha ao criar preferência de pagamento' }, { status: 500 });
    }
}
