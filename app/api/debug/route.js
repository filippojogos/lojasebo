
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;
    return NextResponse.json({
        version: "v3-check-vars",
        status: 'debug_env',
        vercel_env: process.env.VERCEL_ENV,
        node_env: process.env.NODE_ENV,
        has_database_url: !!dbUrl,
        database_url_prefix: dbUrl ? dbUrl.substring(0, 15) : 'MISSING',
        database_url_length: dbUrl ? dbUrl.length : 0,
        // Safely list keys to check if other vars exist
        env_keys: Object.keys(process.env).filter(k => k.includes('DATA') || k.includes('URL') || k.includes('NODE')).sort()
    });
}
