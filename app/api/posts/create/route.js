import { NextResponse } from 'next/server';
import { createPost } from '@/lib/db';
import { applyRateLimit, rateLimitResponse } from '@/lib/rateLimit';

export async function POST(request) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request);
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult.reset);
  }

  try {
    const body = await request.json();
    const { slug, title, date, readTime, tags, excerpt, content, blocks } = body;

    // Validate required fields
    if (!slug || !title || !date || !readTime || !tags) {
      return NextResponse.json(
        { error: 'Required fields: slug, title, date, readTime, tags' },
        { status: 400 }
      );
    }

    // Parse tags
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(tags) ? tags : [];

    // Create post object with common fields
    const newPost = {
      slug,
      title,
      date,
      readTime,
      tags: tagsArray,
    };

    // Support both blocks (new) and content (legacy) formats
    if (blocks && Array.isArray(blocks)) {
      // New format: blocks array
      newPost.blocks = blocks;
      // Auto-generate excerpt from first text block if not provided
      if (!excerpt) {
        const firstText = blocks.find(b => b.type === 'text');
        newPost.excerpt = firstText ? firstText.value.slice(0, 160) : 'No description yet.';
      } else {
        newPost.excerpt = excerpt;
      }
    } else if (content) {
      // Legacy format: content as string or array
      const contentArray = Array.isArray(content) ? content : content.split('\n\n').filter(Boolean);
      newPost.content = contentArray;
      newPost.excerpt = excerpt || contentArray[0] || 'No description yet.';
    } else {
      // No content at all - create default
      newPost.blocks = [{ type: 'text', value: 'Start writing...' }];
      newPost.excerpt = excerpt || 'No description yet.';
    }

    // Save to database
    await createPost(newPost);

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      post: { slug },
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
