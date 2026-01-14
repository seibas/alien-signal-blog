import { NextResponse } from 'next/server';
import { createPost } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, title, date, readTime, tags, excerpt, blocks } = body;

    // Validate required fields
    if (!slug || !title || !date || !readTime || !tags || !excerpt || !blocks || blocks.length === 0) {
      const missing = [];
      if (!slug) missing.push('slug');
      if (!title) missing.push('title');
      if (!date) missing.push('date');
      if (!readTime) missing.push('readTime');
      if (!tags) missing.push('tags');
      if (!excerpt) missing.push('excerpt');
      if (!blocks || blocks.length === 0) missing.push('blocks');
      
      return NextResponse.json(
        { error: 'Missing required fields', missing },
        { status: 400 }
      );
    }

    // Parse tags
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    // Create post object with blocks
    const newPost = {
      slug,
      title,
      date,
      readTime,
      excerpt,
      tags: tagsArray,
      blocks: blocks
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
