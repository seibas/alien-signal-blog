import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    // Read the current posts file
    const postsPath = path.join(process.cwd(), 'content', 'posts.js');
    let postsContent = fs.readFileSync(postsPath, 'utf-8');

    // Check if slug already exists
    if (postsContent.includes(`slug: "${slug}"`)) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Parse tags and content
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentArray = content.split('\n\n').filter(Boolean);

    // Escape special characters in strings
    const escapeString = (str) => {
      // Use template literals if the string contains quotes or newlines
      if (str.includes('"') || str.includes('\n')) {
        return `\`${str.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\``;
      }
      return `"${str.replace(/"/g, '\\"')}"`;
    };

    // Create the new post object as a string
    const newPostString = `  {
    slug: "${slug}",
    title: "${title}",
    date: "${date}",
    readTime: "${readTime}",
    excerpt:
      ${escapeString(excerpt)},
    tags: [${tagsArray.map(t => `"${t}"`).join(', ')}],
    content: [
${contentArray.map(para => `      ${escapeString(para)}`).join(',\n')}
    ],
  }`;

    // Find the closing bracket of the posts array and insert before it
    const arrayEndIndex = postsContent.lastIndexOf('];');
    
    if (arrayEndIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid posts.js format' },
        { status: 500 }
      );
    }

    // Check if there are existing posts and add comma if needed
    const beforeArrayEnd = postsContent.substring(0, arrayEndIndex).trim();
    const needsComma = beforeArrayEnd.endsWith('}') || beforeArrayEnd.endsWith('},');
    
    // Insert the new post
    const updatedContent = 
      postsContent.substring(0, arrayEndIndex) +
      (needsComma && !beforeArrayEnd.endsWith(',') ? ',' : '') +
      '\n' + newPostString + ',\n' +
      postsContent.substring(arrayEndIndex);

    // Write back to the file
    fs.writeFileSync(postsPath, updatedContent, 'utf-8');

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
