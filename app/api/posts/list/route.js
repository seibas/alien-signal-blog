import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db';

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    return NextResponse.json({ 
      success: true,
      posts: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}
