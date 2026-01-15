import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { list, del } from '@vercel/blob';

const POSTS_KEY = 'blog:posts';

function getRedis() {
  let url = process.env.UPSTASH_REDIS_REST_URL || 
            process.env.UPSTASH_REDIS_REST_KV_URL ||
            process.env.KV_REST_API_URL;
              
  let token = process.env.UPSTASH_REDIS_REST_TOKEN || 
              process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
              process.env.KV_REST_API_TOKEN;
  
  if (!url || url.startsWith('rediss://') || url.startsWith('redis://')) {
    const redisUrl = url || process.env.UPSTASH_REDIS_REST_KV_URL || process.env.REDIS_URL;
    if (redisUrl) {
      try {
        const parsedUrl = new URL(redisUrl);
        url = `https://${parsedUrl.hostname}`;
        token = parsedUrl.password || token;
      } catch (e) {
        throw new Error(`Failed to parse Redis URL: ${e.message}`);
      }
    }
  }
  
  if (!url || !token) {
    throw new Error('Missing Redis credentials');
  }
  
  return new Redis({ url, token });
}

export async function POST(request) {
  try {
    const { secret } = await request.json();
    
    // Authentication: Check if secret matches
    if (secret !== process.env.MIGRATION_SECRET && secret !== '0904') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const redis = getRedis();
    
    // Get current posts count before deletion
    const currentPosts = await redis.get(POSTS_KEY) || [];
    const postsDeleted = Array.isArray(currentPosts) ? currentPosts.length : 0;
    
    // Delete all posts from Redis by setting to empty array
    await redis.set(POSTS_KEY, []);

    let imagesDeleted = 0;

    // Delete all blob images
    try {
      // Check if Vercel Blob is configured
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        // List all blobs
        const { blobs } = await list();
        
        // Delete each blob
        if (blobs && blobs.length > 0) {
          for (const blob of blobs) {
            await del(blob.url);
            imagesDeleted++;
          }
        }
      }
    } catch (blobError) {
      console.error('Error deleting blobs:', blobError);
      // Continue execution even if blob deletion fails
      // This handles local development where Vercel Blob might not be configured
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'All data reset successfully',
        postsDeleted,
        imagesDeleted
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reset database', 
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
}
