import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { slug, title, date, readTime, tags, content } = await request.json();

    // Read the current posts file
    const postsPath = path.join(process.cwd(), 'content', 'posts.js');
    let postsContent = fs.readFileSync(postsPath, 'utf-8');

    // Parse tags and content
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentArray = content.split('\n\n').filter(Boolean);

    // Create the updated post object as a string
    const updatedPostString = `  {
    slug: "${slug}",
    title: "${title}",
    date: "${date}",
    readTime: "${readTime}",
    excerpt:
      "${contentArray[0] || ''}",
    tags: [${tagsArray.map(t => `"${t}"`).join(', ')}],
    content: [
${contentArray.map(para => `      "${para.replace(/"/g, '\\"')}"`).join(',\n')}
    ],
  }`;

    // Find and replace the specific post using regex
    const postRegex = new RegExp(
      `\\{[^}]*slug:\\s*"${slug}"[^}]*\\}(?:[^{]*\\{[^}]*\\})*`,
      's'
    );

    // More robust regex to match the entire post object
    const fullPostRegex = new RegExp(
      `\\{\\s*slug:\\s*"${slug}",[\\s\\S]*?\\},(?=\\s*(?:\\{|\\];))`,
      ''
    );

    if (fullPostRegex.test(postsContent)) {
      postsContent = postsContent.replace(fullPostRegex, updatedPostString + ',');
    } else {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Write back to the file
    fs.writeFileSync(postsPath, postsContent, 'utf-8');

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
