import { NextResponse } from 'next/server';
import { updatePost } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, title, date, readTime, tags, content, blocks } = body;

    // Parse tags
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(tags) ? tags : [];

    let updatedPost = {
      slug,
      title,
      date,
      readTime,
      tags: tagsArray,
    };

    // Support legacy and new format
    if (blocks && Array.isArray(blocks)) {
      updatedPost.blocks = blocks;
      // Use first text block as excerpt if available
      const firstText = blocks.find(b => b.type === 'text');
      updatedPost.excerpt = firstText ? firstText.value.slice(0, 160) : '';
    } else if (content) {
      // Legacy: content as string or array
      const contentArray = Array.isArray(content) ? content : content.split('\n\n').filter(Boolean);
      updatedPost.content = contentArray;
      updatedPost.excerpt = contentArray[0] || '';
    }

    // Update in database
    await updatePost(slug, updatedPost);

    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully' 
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    );
  }
}
