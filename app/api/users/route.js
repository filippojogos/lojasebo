import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app/data/users.json');

function getUsers() {
    if (!fs.existsSync(dataPath)) return [];
    const file = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(file);
}

export async function GET() {
    const users = getUsers();
    return NextResponse.json(users);
}
