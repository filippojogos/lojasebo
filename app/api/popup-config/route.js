import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/popup-config.json');

// Ensure data dir exists
async function ensureFile() {
    try {
        await fs.mkdir(path.join(process.cwd(), 'app/data'), { recursive: true });
        try {
            await fs.access(dataFilePath);
        } catch {
            // Default config
            await fs.writeFile(dataFilePath, JSON.stringify({
                active: true,
                type: 'maintenance', // 'maintenance' or 'image'
                imageUrl: '',
                linkUrl: ''
            }, null, 2));
        }
    } catch (e) {
        console.error("Error init popup config", e);
    }
}

export async function GET() {
    await ensureFile();
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return new Response(data, { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ active: false }), { status: 500 });
    }
}

export async function POST(req) {
    await ensureFile();
    try {
        const body = await req.json();
        await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2));
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
    }
}
