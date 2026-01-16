import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const statsFile = path.join(process.cwd(), 'app/data/visitor-ips.json');

// Helper to get stats
async function getStats() {
    try {
        await fs.mkdir(path.join(process.cwd(), 'app/data'), { recursive: true });
        const data = await fs.readFile(statsFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return { daily: {}, total: 0 };
    }
}

export async function GET() {
    const data = await getStats();
    // Calculate total unique IPs across all days
    // Or just a simple total count? User asked for "contagem de cliente por IPs diferentes".
    // Let's return total unique IPs ever logged + total visits today.

    // Total Unique IPs (overall)
    const allIps = new Set();
    Object.values(data.daily).forEach(dayIps => dayIps.forEach(ip => allIps.add(ip)));

    // Today's count
    const today = new Date().toISOString().split('T')[0];
    const todayCount = (data.daily[today] || []).length;

    return new Response(JSON.stringify({
        visits: allIps.size, // Total Unique Visitors
        today: todayCount
    }), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
    try {
        // Get IP
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
        const today = new Date().toISOString().split('T')[0];

        const data = await getStats();

        if (!data.daily) data.daily = {};
        if (!data.daily[today]) data.daily[today] = [];

        // Add if unique for that day? Or unique global?
        // Usually "Daily Unique" and "Total Unique".
        // Let's store unique per day.

        if (!data.daily[today].includes(ipHash)) {
            data.daily[today].push(ipHash);
            await fs.writeFile(statsFile, JSON.stringify(data, null, 2));
        }

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
    }
}
