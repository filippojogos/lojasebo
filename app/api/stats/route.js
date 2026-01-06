import { promises as fs } from 'fs';
import path from 'path';

const statsFile = path.join(process.cwd(), 'app/data/stats.json');

async function ensureStats() {
    try {
        await fs.mkdir(path.join(process.cwd(), 'app/data'), { recursive: true });
        try {
            await fs.access(statsFile);
        } catch {
            await fs.writeFile(statsFile, JSON.stringify({ visits: 0, likes: {} }));
        }
    } catch (e) { }
}

export async function GET() {
    await ensureStats();
    try {
        const data = await fs.readFile(statsFile, 'utf8');
        return new Response(data, { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ visits: 0 }), { status: 500 });
    }
}

export async function POST(req) {
    await ensureStats();
    try {
        const body = await req.json(); // { action: 'visit' }
        const data = JSON.parse(await fs.readFile(statsFile, 'utf8'));

        if (body.action === 'visit') {
            data.visits = (data.visits || 0) + 1;
        }

        await fs.writeFile(statsFile, JSON.stringify(data, null, 2));
        return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
    }
}
