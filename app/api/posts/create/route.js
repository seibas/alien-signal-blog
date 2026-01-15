import { NextResponse } from 'next/server';
import { createPost } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    let { slug, title, date, readTime, tags, excerpt, blocks } = body;

    // Auto-generate missing fields server-side - no validation!
    const postTitle = (title || '').trim() || 'Untitled Post';
    const postSlug = (slug || '').trim() || `untitled-${Date.now()}`;
    const postExcerpt = (excerpt || '').trim() || 'No description yet.';
    const postTags = (tags || '').trim() || 'draft';
    const postDate = (date || '').trim() || new Date().toISOString().split('T')[0];
    const postReadTime = (readTime || '').trim() || '1 min';
    const postBlocks = (blocks && blocks.length > 0) ? blocks : [{ type: 'text', value: 'Start writing...' }];

    // Parse tags
    const tagsArray = postTags.split(',').map(t => t.trim()).filter(Boolean);

    // Create post object with blocks
    const newPost = {
      slug: postSlug,
      title: postTitle,
      date: postDate,
      readTime: postReadTime,
      excerpt: postExcerpt,
      tags: tagsArray,
      blocks: postBlocks
    };

    // Save to database
    await createPost(newPost);

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      post: { slug: postSlug }
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}
