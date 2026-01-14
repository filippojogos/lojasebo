
import { NextResponse } from 'next/server';

const SUPER_FRETE_TOKEN = process.env.SUPER_FRETE_TOKEN;
const ORIGIN_CEP = process.env.ORIGIN_CEP || "05458-001";

export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, products, destCep, destName, destStreet, destNumber, destCity, destUf } = body;

        // In a real app, you would validate the order and user here.

        // Construct package from products similar to calc
        let totalWeight = 0;
        let totalHeight = 0;
        let totalWidth = 0;
        let totalLength = 0;

        products.forEach(p => {
            const qty = p.qty || 1;
            const w = p.weight || 0.3;
            const h = p.height || 2;
            const wid = p.width || 11;
            const len = p.depth || 16;

            totalWeight += (w * qty);
            totalHeight += (h * qty);
            totalWidth = Math.max(totalWidth, wid);
            totalLength = Math.max(totalLength, len);
        });

        const payload = {
            service: 1, // 1 = PAC (Defaulting for now, could be dynamic)
            agency: 0,
            from: {
                name: "Sebo da Esquina", // Store Name
                postal_code: ORIGIN_CEP.replace(/\D/g, ''),
                address: "Rua Exemplo",
                number: "123",
                complement: "Sala 1",
                district: "Centro", // Hardcoded for now if not in env
                city: "São Paulo",
                state: "SP"
            },
            to: {
                name: destName,
                postal_code: destCep.replace(/\D/g, ''),
                address: destStreet,
                number: destNumber,
                // complement: "", 
                district: "Centro", // Required by some APIs, defaults if unknown
                city: destCity,
                state: destUf
            },
            package: {
                weight: Math.max(totalWeight, 0.3),
                height: Math.max(totalHeight, 2),
                width: Math.max(totalWidth, 11),
                length: Math.max(totalLength, 16)
            },
            options: {
                own_hand: false,
                receipt: false,
                insurance_value: 0
            }
        };

        // Note: This is an example endpoint. Actual Super Frete Label Generation might be different (e.g. /cart, /order). 
        // This is a placeholder for the integration pattern.
        // Assuming: https://api.superfrete.com/api/v0/cart (Add to cart then checkout) OR direct label.
        // For this task, we will simulate the success response unless the user specifically wants the full flow which costs $$$ (real labels).
        // WE WILL RETURN A MOCK SUCCESS to avoid generating real costs/labels during dev unless explicitly told.

        // REAL CALL (Commented out for safety/cost unless confirmed):
        /*
        const res = await fetch('https://api.superfrete.com/api/v0/cart', {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPER_FRETE_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        */

        return NextResponse.json({
            success: true,
            message: "Etiqueta gerada (SIMULAÇÃO)",
            trackingCode: "SF123456789BR",
            url: "https://superfrete.com/etiqueta-exemplo.pdf"
        });

    } catch (error) {
        console.error("Label Gen Error:", error);
        return NextResponse.json({ error: "Falha ao gerar etiqueta" }, { status: 500 });
    }
}
