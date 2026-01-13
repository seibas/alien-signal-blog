import Anthropic from '@anthropic-ai/sdk';
import { logApiError } from '@/lib/errorLogger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { content, targetLanguage, postTitle } = await request.json();

    if (!content || !targetLanguage) {
      return Response.json(
        { error: 'Missing content or target language' },
        { status: 400 }
      );
    }

    // Only support Italian for now
    if (targetLanguage !== 'it') {
      return Response.json(
        { error: 'Only Italian translation is supported' },
        { status: 400 }
      );
    }

    // Prepare content for translation
    const contentToTranslate = JSON.stringify(content);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `You are a professional Italian translator specializing in technical content and coding blogs.

Translate the following blog post content from English to Italian. The content is in JSON format with blocks of text and code.

CRITICAL RULES:
1. Translate ALL text content to natural, fluent Italian
2. Do NOT translate code blocks - keep code exactly as is
3. Do NOT translate technical terms like: React, JavaScript, API, CSS, HTML, etc.
4. Keep the exact same JSON structure
5. Preserve all markdown formatting
6. Keep emojis as-is
7. Maintain professional, technical blog tone
8. For code comments in code blocks, you MAY translate those to Italian

Post Title: "${postTitle}"

Content to translate:
${contentToTranslate}

Return ONLY the translated JSON structure, nothing else. No explanations, no markdown code blocks, just the pure JSON.`,
        },
      ],
    });

    // Extract the translated content
    const translatedText = message.content[0].text;

    // Parse the JSON response
    let translatedContent;
    try {
      translatedContent = JSON.parse(translatedText);
    } catch (parseError) {
      return Response.json(
        { error: 'Translation parsing failed' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      translatedContent,
    });

  } catch (error) {
    logApiError('/api/translate', error, 500, {
      targetLanguage,
      postTitle: postTitle?.substring(0, 50)
    });

    return Response.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    );
  }
}
