import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// Helper to get or create config
async function getConfig() {
    try {
        let config = await prisma.homeConfig.findFirst();
        if (!config) {
            config = await prisma.homeConfig.create({
                data: {
                    mainHighlights: '[]',
                    categoryHighlights: '{}'
                }
            });
        }
        return {
            mainHighlights: JSON.parse(config.mainHighlights),
            categoryHighlights: JSON.parse(config.categoryHighlights)
        };
    } catch (e) {
        console.error("HomeConfig Fetch Error:", e);
        return { mainHighlights: [], categoryHighlights: {} };
    }
}

export async function GET() {
    const config = await getConfig();
    return NextResponse.json(config);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { mainHighlights, categoryHighlights } = body;

        // Upsert logic (update first found or create)
        const existing = await prisma.homeConfig.findFirst();

        let saved;
        if (existing) {
            saved = await prisma.homeConfig.update({
                where: { id: existing.id },
                data: {
                    mainHighlights: JSON.stringify(mainHighlights || []),
                    categoryHighlights: JSON.stringify(categoryHighlights || {})
                }
            });
        } else {
            saved = await prisma.homeConfig.create({
                data: {
                    mainHighlights: JSON.stringify(mainHighlights || []),
                    categoryHighlights: JSON.stringify(categoryHighlights || {})
                }
            });
        }

        return NextResponse.json({
            mainHighlights: JSON.parse(saved.mainHighlights),
            categoryHighlights: JSON.parse(saved.categoryHighlights)
        });

    } catch (error) {
        console.error("HomeConfig Save Error:", error);
        return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
}
