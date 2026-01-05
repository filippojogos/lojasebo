import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const bannersFilePath = path.join(process.cwd(), 'app/data/banners.json');

function getBanners() {
    try {
        if (!fs.existsSync(bannersFilePath)) {
            return [];
        }
        const fileData = fs.readFileSync(bannersFilePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error reading banners:", error);
        return [];
    }
}

function saveBanners(banners) {
    try {
        fs.writeFileSync(bannersFilePath, JSON.stringify(banners, null, 4));
        return true;
    } catch (error) {
        console.error("Error saving banners:", error);
        return false;
    }
}

export async function GET() {
    const banners = getBanners();
    return NextResponse.json(banners.sort((a, b) => a.order - b.order));
}

export async function POST(request) {
    try {
        const banners = getBanners();
        const newBanner = await request.json();

        // Simple ID generation
        const maxId = banners.reduce((max, b) => (b.id > max ? b.id : max), 0);
        newBanner.id = maxId + 1;

        // Default values if missing
        newBanner.duration = newBanner.duration || 5;
        newBanner.order = banners.length + 1;

        banners.push(newBanner);
        saveBanners(banners);

        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const banners = getBanners();
        const updatedData = await request.json();

        // If it's an array, it's a reorder/bulk update
        if (Array.isArray(updatedData)) {
            saveBanners(updatedData);
            return NextResponse.json({ message: 'Order updated' });
        }

        // Single update
        const index = banners.findIndex(b => b.id === updatedData.id);
        if (index !== -1) {
            banners[index] = { ...banners[index], ...updatedData };
            saveBanners(banners);
            return NextResponse.json(banners[index]);
        }

        return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        let banners = getBanners();
        banners = banners.filter(b => b.id !== id);
        saveBanners(banners);

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
