import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    const { type } = await request.json();

    let folder = 'medbridge/books/covers';
    let resourceType = 'image';
    if (type === 'pdf') {
      folder = 'medbridge/books/pdfs';
      resourceType = 'raw';
    } else if (type === 'video') {
      folder = 'medbridge/videos';
      resourceType = 'video';
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: apiKey,
      cloudName: cloudName,
      folder,
      resourceType,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signature generation failed' }, { status: 500 });
  }
}
