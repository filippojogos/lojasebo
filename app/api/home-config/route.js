import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'app/data/home-config.json');

function getConfig() {
    try {
        if (!fs.existsSync(configFilePath)) {
            return { mainHighlights: [], categoryHighlights: {} };
        }
        const fileData = fs.readFileSync(configFilePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error reading home config:", error);
        return { mainHighlights: [], categoryHighlights: {} };
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4));
        return true;
    } catch (error) {
        console.error("Error saving home config:", error);
        return false;
    }
}

export async function GET() {
    const config = getConfig();
    return NextResponse.json(config);
}

export async function POST(request) {
    try {
        const newConfig = await request.json();
        saveConfig(newConfig);
        return NextResponse.json(newConfig);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
}
