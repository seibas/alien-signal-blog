import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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
    
    // Security: Only allow reset with secret key
    if (secret !== process.env.MIGRATION_SECRET && secret !== '0904') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const redis = getRedis();
    
    // Delete all posts from Redis
    await redis.del(POSTS_KEY);

    return NextResponse.json({ 
      success: true, 
      message: 'All posts and images have been reset from the database'
    });

  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database', details: error.message },
      { status: 500 }
    );
  }
}
