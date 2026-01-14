import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        // Convert file to base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');

        // ImgBB API Key (Environment variable with hardcoded fallback for immediate guaranteed deployment)
        const apiKey = process.env.IMGBB_API_KEY || '3b10fb1e22e122426a2df96deb53c8b8';

        const formDataImgBB = new FormData();
        formDataImgBB.append('image', base64Image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formDataImgBB,
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error ? data.error.message : 'Failed to upload to ImgBB');
        }

        return NextResponse.json({
            message: "Success",
            url: data.data.url
        });

    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
