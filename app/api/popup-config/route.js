import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Ensure correct path to your prisma instance

// Helper to get or create config
async function getParams() {
    let config = await prisma.popupConfig.findFirst();
    if (!config) {
        config = await prisma.popupConfig.create({
            data: {
                active: true,
                type: 'maintenance',
                imageUrl: '',
                linkUrl: ''
            }
        });
    }
    return config;
}

export async function GET() {
    try {
        const config = await getParams();
        return NextResponse.json(config);
    } catch (e) {
        console.error("Popup GET error:", e);
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        // Upsert logic: update the first record found, or create if none
        const existing = await prisma.popupConfig.findFirst();

        let result;
        if (existing) {
            result = await prisma.popupConfig.update({
                where: { id: existing.id },
                data: {
                    active: body.active,
                    type: body.type,
                    imageUrl: body.imageUrl,
                    linkUrl: body.linkUrl
                }
            });
        } else {
            result = await prisma.popupConfig.create({
                data: {
                    active: body.active,
                    type: body.type,
                    imageUrl: body.imageUrl,
                    linkUrl: body.linkUrl
                }
            });
        }

        return NextResponse.json(result);
    } catch (e) {
        console.error("Popup POST error:", e);
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
