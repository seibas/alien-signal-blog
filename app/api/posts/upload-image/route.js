import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const isAvatar = formData.get('isAvatar') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Create filename - use 'avatar.jpg' if it's an avatar, otherwise timestamp
    let filename;
    
    // Get extension from MIME type to avoid issues with file names
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    };
    const ext = mimeToExt[file.type] || 'jpg';
    
    if (isAvatar) {
      filename = `avatar.${ext}`;
    } else {
      const timestamp = Date.now();
      // Get base name without any extension
      const baseName = file.name.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '_');
      filename = `${timestamp}-${baseName}.${ext}`;
    }

    // Check if we're in production (Vercel) and Blob is configured
    const isProduction = process.env.VERCEL === '1';
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    if (isProduction && hasBlobToken) {
      try {
        // Use Vercel Blob storage in production
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: file.type,
        });

        return NextResponse.json({
          success: true,
          filename: filename,
          url: blob.url,
          message: 'Image uploaded successfully'
        });
      } catch (blobError) {
        console.error('Blob storage error:', blobError);
        return NextResponse.json({
          error: 'Blob storage not configured',
          details: 'Please set up Vercel Blob storage or use image hosting services like Imgur/Cloudinary and paste the URL directly',
          helpText: 'Format: ![description](https://your-image-url.com/image.jpg)'
        }, { status: 503 });
      }
    }
    
    if (isProduction && !hasBlobToken) {
      return NextResponse.json({
        error: 'Image uploads not available in production',
        details: 'Please use an image hosting service like Imgur or Cloudinary and paste the URL',
        helpText: 'Format: ![description](https://your-image-url.com/image.jpg)'
      }, { status: 503 });
    }

    // Local development: save to public/images
    const uploadDir = join(process.cwd(), 'public', 'images');

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: `/images/${filename}`,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}
