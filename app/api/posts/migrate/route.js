import { NextResponse } from 'next/server';
import { initializePosts } from '@/lib/db';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function POST(request) {
  try {
    // Security: Only allow migration with a secret key
    const { secret, posts } = await request.json();
    
    if (secret !== process.env.MIGRATION_SECRET && secret !== '0904') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json(
        { error: 'Invalid posts data' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Initialize the database with posts
    await initializePosts(posts);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${posts.length} posts to database`,
      count: posts.length
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Error migrating posts:', error);
    return NextResponse.json(
      { error: 'Failed to migrate posts', details: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}
