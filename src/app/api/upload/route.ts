import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'cover';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    // Determine folder and resource type based on file type
    const folder = type === 'pdf' ? 'medbridge/books/pdfs' : 'medbridge/books/covers';
    const resourceType = type === 'pdf' ? 'raw' : 'image';

    // Create Cloudinary signed upload
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + CLOUDINARY_API_SECRET)
      .digest('hex');

    // Build multipart form data for Cloudinary
    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', file);
    cloudinaryForm.append('api_key', CLOUDINARY_API_KEY);
    cloudinaryForm.append('timestamp', timestamp.toString());
    cloudinaryForm.append('signature', signature);
    cloudinaryForm.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const cloudinaryRes = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudinaryForm,
    });

    const cloudinaryData = await cloudinaryRes.json();

    if (!cloudinaryRes.ok || cloudinaryData.error) {
      console.error('Cloudinary error:', cloudinaryData);
      return NextResponse.json(
        { error: cloudinaryData.error?.message || 'Cloudinary upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      fileName: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      publicId: cloudinaryData.public_id,
    });
  } catch (err: any) {
    console.error('Upload route error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
