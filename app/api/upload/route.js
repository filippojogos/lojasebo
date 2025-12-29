
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
        const filePath = path.join(process.cwd(), 'public/uploads', filename);

        await fs.promises.writeFile(filePath, buffer);

        return NextResponse.json({
            message: "Success",
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
