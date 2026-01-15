import { NextResponse } from 'next/server';
import { createPost } from '@/lib/db';

export async function POST(request) {
  try {
    const { slug, title, date, readTime, tags, excerpt, content } = await request.json();

    // Validate required fields
    if (!slug || !title || !date || !readTime || !tags || !excerpt || !content) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Parse tags and content
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentArray = content.split('\n\n').filter(Boolean);

    // Create post object
    const newPost = {
      slug,
      title,
      date,
      readTime,
      excerpt,
      tags: tagsArray,
      content: contentArray
    };

    // Save to database
    await createPost(newPost);

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      slug: slug
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}
