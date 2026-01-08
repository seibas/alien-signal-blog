import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, date, author, tags, content, blocks } = body;

    // Validate required fields
    if (!title || !slug || !date || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, date, and author are required' },
        { status: 400 }
      );
    }

    // Validate that either content or blocks is provided
    if (!content && !blocks) {
      return NextResponse.json(
        { error: 'Either content or blocks must be provided' },
        { status: 400 }
      );
    }

    // Create the post data structure
    const postData = {
      title,
      slug,
      excerpt: excerpt || '',
      date,
      author,
      tags: tags || [],
    };

    // Support both new blocks format and legacy content format
    if (blocks && Array.isArray(blocks)) {
      // New blocks format
      postData.blocks = blocks;
    } else if (content) {
      // Legacy content format - convert to blocks if needed
      // or keep as-is for backward compatibility
      postData.content = content;
      
      // Optionally, auto-convert legacy content to blocks format
      // Uncomment the following to enable auto-conversion:
      /*
      postData.blocks = [{
        type: 'paragraph',
        content: content
      }];
      */
    }

    // Convert to JSON string with proper formatting
    const jsonContent = JSON.stringify(postData, null, 2);

    // Define the posts directory path
    const postsDirectory = path.join(process.cwd(), 'data', 'posts');

    // Ensure the posts directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // Create the file path
    const filePath = path.join(postsDirectory, `${slug}.json`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Write the file
    fs.writeFileSync(filePath, jsonContent, 'utf8');

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        post: postData,
        format: blocks ? 'blocks' : 'legacy'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}
