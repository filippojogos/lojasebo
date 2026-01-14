
import { NextResponse } from 'next/server';

// Configuration (In a real app, these should be environment variables)
// Configuration
const SUPER_FRETE_TOKEN = process.env.SUPER_FRETE_TOKEN;
const ORIGIN_CEP = process.env.ORIGIN_CEP || "05458-001";

export async function POST(request) {
    try {
        const { destCep, products } = await request.json();

        if (!destCep) {
            return NextResponse.json({ error: 'CEP de destino obrigatório' }, { status: 400 });
        }

        // Calculate total weight and dimensions
        let totalWeight = 0;
        let totalHeight = 0;
        let totalWidth = 0;
        let totalLength = 0;

        products.forEach(p => {
            const qty = p.qty || 1;
            // Use DB fields (weight, width, height, depth) or fallbacks
            const w = p.weight || 0.3; // kg
            const h = p.height || 2;   // cm
            const wid = p.width || 11; // cm
            const len = p.depth || 16; // cm (depth mapped to length for shipping)

            totalWeight += (w * qty);
            totalHeight += (h * qty);
            totalWidth = Math.max(totalWidth, wid);
            totalLength = Math.max(totalLength, len);
        });

        // Super Frete / Correios Limits
        // Min Height: 2cm, Min Width: 11cm, Min Length: 16cm
        const packageData = {
            from: {
                postal_code: ORIGIN_CEP.replace(/\D/g, '')
            },
            to: {
                postal_code: destCep.replace(/\D/g, '')
            },
            services: "1,2", // 1=PAC, 2=SEDEX (SuperFrete codes might vary, usually 1=PAC, 2=SEDEX or 'PAC','SEDEX' strings)
            // Super Frete API format usually takes 'package' object
            package: {
                weight: Math.max(totalWeight, 0.3), // Min 300g
                height: Math.max(totalHeight, 2),
                width: Math.max(totalWidth, 11),
                length: Math.max(totalLength, 16)
            },
            options: {
                own_hand: false,
                receipt: false,
                insurance_value: 0 // Optional: Add insurance based on cart total
            }
        };

        // Note: Super Frete API endpoint needs to be verified. 
        // Using the standard calculator endpoint structure.
        // If this URL is incorrect, we might need to check docs.
        // Assuming: https://api.superfrete.com/api/v0/calculator/

        const res = await fetch('https://api.superfrete.com/api/v0/calculator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPER_FRETE_TOKEN}`,
                'User-Agent': 'LojaSebo/1.0'
            },
            body: JSON.stringify(packageData)
        });

        if (!res.ok) {
            const errData = await res.json();
            console.error("Super Frete Error:", errData);
            return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Shipping Calc Error:", error);
        return NextResponse.json({ error: 'Erro interno no cálculo de frete' }, { status: 500 });
    }
}
