import { NextResponse } from 'next/server';
import { updatePost } from '@/lib/db';

export async function POST(request) {
  try {
    const { slug, title, date, readTime, tags, content } = await request.json();

    // Parse tags and content
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentArray = content.split('\n\n').filter(Boolean);

    // Create updated post object
    const updatedPost = {
      slug,
      title,
      date,
      readTime,
      excerpt: contentArray[0] || '',
      tags: tagsArray,
      content: contentArray
    };

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
