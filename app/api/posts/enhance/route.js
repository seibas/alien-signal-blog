import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Calculate reading time (approx 200 words per minute)
function calculateReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse content into blocks (text, code, images)
function parseContentToBlocks(content) {
  const blocks = [];

  // Regex to match code blocks: ```language\ncode\n```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ type: 'text', value: textBefore });
      }
    }

    // Add code block
    blocks.push({
      type: 'code',
      language: match[1] || 'javascript',
      value: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex).trim();
    if (remainingText) {
      // Check for images in remaining text
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let imgLastIndex = 0;
      let imgMatch;

      while ((imgMatch = imageRegex.exec(remainingText)) !== null) {
        // Text before image
        if (imgMatch.index > imgLastIndex) {
          const textBefore = remainingText.substring(imgLastIndex, imgMatch.index).trim();
          if (textBefore) {
            blocks.push({ type: 'text', value: textBefore });
          }
        }

        // Image block
        blocks.push({
          type: 'image',
          src: imgMatch[2],
          alt: imgMatch[1] || ''
        });

        imgLastIndex = imgMatch.index + imgMatch[0].length;
      }

      // Remaining text after images
      if (imgLastIndex < remainingText.length) {
        const finalText = remainingText.substring(imgLastIndex).trim();
        if (finalText) {
          blocks.push({ type: 'text', value: finalText });
        }
      } else if (imgLastIndex === 0) {
        // No images found, add as text
        blocks.push({ type: 'text', value: remainingText });
      }
    }
  }

  // If no blocks, add default
  if (blocks.length === 0) {
    blocks.push({ type: 'text', value: content || 'Start writing...' });
  }

  return blocks;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, useAI = true } = body;

    if (!content && !title) {
      return NextResponse.json(
        { error: 'Title or content is required' },
        { status: 400 }
      );
    }

    const fullContent = content || '';
    const postTitle = title || 'Untitled Post';

    // Basic processing (no API needed)
    const slug = generateSlug(postTitle);
    const readTime = calculateReadTime(fullContent);
    const blocks = parseContentToBlocks(fullContent);
    const date = new Date().toISOString().split('T')[0];

    // Default excerpt (first 160 chars of content)
    let excerpt = fullContent.substring(0, 160).trim();
    if (fullContent.length > 160) excerpt += '...';

    // Default tags based on simple keyword detection
    let tags = ['draft'];
    const lowerContent = fullContent.toLowerCase();

    const tagKeywords = {
      'javascript': ['javascript', 'js', 'node', 'npm'],
      'react': ['react', 'component', 'useState', 'useEffect', 'jsx'],
      'nextjs': ['next.js', 'nextjs', 'next', 'app router'],
      'python': ['python', 'pip', 'django', 'flask'],
      'css': ['css', 'style', 'flexbox', 'grid', 'animation'],
      'ai': ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'claude'],
      'learning': ['learn', 'tutorial', 'beginner', 'guide', 'how to'],
      'project': ['project', 'build', 'create', 'making'],
      'tips': ['tips', 'tricks', 'hack', 'improve'],
      'web-dev': ['web', 'frontend', 'backend', 'api', 'http']
    };

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(kw => lowerContent.includes(kw))) {
        tags.push(tag);
      }
    }

    // Limit to 5 tags
    tags = [...new Set(tags)].slice(0, 5);

    // If API key exists and useAI is true, enhance with Claude
    if (useAI && process.env.ANTHROPIC_API_KEY) {
      try {
        const message = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `Analyze this blog post and return ONLY a JSON object (no markdown, no explanation):

Title: ${postTitle}
Content: ${fullContent.substring(0, 1500)}

Return JSON with:
- "excerpt": compelling 1-2 sentence summary (max 160 chars)
- "tags": array of 3-5 relevant tags from: javascript, react, nextjs, python, css, ai, learning, project, tips, web-dev, journey, tutorial, coding

JSON only:`
            }
          ]
        });

        // Parse AI response
        const aiText = message.content[0]?.text || '';
        try {
          // Try to extract JSON from response
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiData = JSON.parse(jsonMatch[0]);
            if (aiData.excerpt) excerpt = aiData.excerpt;
            if (aiData.tags && Array.isArray(aiData.tags)) {
              tags = aiData.tags.slice(0, 5);
            }
          }
        } catch (parseError) {
          console.log('AI response parse error, using defaults');
        }
      } catch (aiError) {
        console.log('AI enhancement failed, using defaults:', aiError.message);
      }
    }

    return NextResponse.json({
      success: true,
      enhanced: {
        slug,
        title: postTitle,
        date,
        readTime,
        excerpt,
        tags,
        blocks,
        status: 'draft'
      }
    });

  } catch (error) {
    console.error('Enhance error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance post', details: error.message },
      { status: 500 }
    );
  }
}
