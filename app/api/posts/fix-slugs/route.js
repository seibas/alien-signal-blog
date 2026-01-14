import { NextResponse } from 'next/server';
import { getAllPosts, updatePost } from '@/lib/db';

// Generate URL-safe slug from text
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

export async function POST() {
  try {
    const posts = await getAllPosts();
    const fixes = [];
    
    for (const post of posts) {
      // Check if slug has spaces or special characters (not URL-safe)
      if (/[\s:!"'`~@#$%^&*()+=\[\]{}|\\;,.<>?/🛸]/.test(post.slug)) {
        const oldSlug = post.slug;
        const newSlug = generateSlug(post.title || post.slug);
        
        // Update the post with new slug
        await updatePost(oldSlug, { ...post, slug: newSlug });
        
        fixes.push({ oldSlug, newSlug });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Fixed ${fixes.length} slugs`,
      fixes
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fix slugs', details: error.message },
      { status: 500 }
    );
  }
}
