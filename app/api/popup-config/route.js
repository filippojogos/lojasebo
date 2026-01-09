import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// Helper to get the SINGLETON config
async function getParams() {
    // Busca todas as configs ordenadas por ID
    const configs = await prisma.popupConfig.findMany({
        orderBy: { id: 'asc' }
    });

    if (configs.length === 0) {
        // Se não existir, cria a primeira
        return await prisma.popupConfig.create({
            data: {
                active: true,
                type: 'maintenance',
                imageUrl: '',
                linkUrl: ''
            }
        });
    }

    // Se houver mais de uma, mantém a primeira e deleta as outras (Auto-Clean)
    if (configs.length > 1) {
        const [keep, ...remove] = configs;
        const idsToRemove = remove.map(c => c.id);

        console.warn(`[PopupConfig] Found ${configs.length} configs. Cleaning up ${idsToRemove.length} duplicates...`);

        try {
            await prisma.popupConfig.deleteMany({
                where: {
                    id: { in: idsToRemove }
                }
            });
        } catch (cleanupError) {
            console.error("Popup cleanup failed (locked?):", cleanupError);
            // Ignore error and continue to return 'keep'
        }

        return keep;
    }

    // Retorna a única existente
    return configs[0];
}

export async function GET() {
    try {
        const config = await getParams();
        return NextResponse.json(config, { status: 200 });
    } catch (e) {
        console.error("Popup GET error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();

        // Garante que estamos operando sobre a config correta (ou cria se não existir)
        let currentConfig = await getParams();

        const updated = await prisma.popupConfig.update({
            where: { id: currentConfig.id },
            data: {
                active: body.active,
                type: body.type,
                imageUrl: body.imageUrl,
                linkUrl: body.linkUrl
            }
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (e) {
        console.error("Popup POST error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
