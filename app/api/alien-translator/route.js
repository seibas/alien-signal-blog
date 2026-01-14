import { Anthropic } from '@anthropic-ai/sdk';
import { checkRateLimit } from '@/lib/rateLimiter';
import { getAllPosts } from '@/lib/db';
import { logApiError } from '@/lib/errorLogger';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  // Check if API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({
      error: '🛸 Configuration Error: ANTHROPIC_API_KEY is not set. Please add it in Vercel Dashboard → Settings → Environment Variables.'
    }), { status: 500 });
  }

  if (req.method && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { question, language = 'javascript', userHistory = [] } = body;

  // Validate input
  if (!question || question.length > 500) {
    return new Response(JSON.stringify({ 
      error: 'Question required and must be under 500 characters' 
    }), { status: 400 });
  }


  // Rate limiting (3/hour for anonymous)
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimit = await checkRateLimit(identifier, 'anonymous');
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      error: `🛸 Cosmic bandwidth exceeded! Try again in ${rateLimit.resetIn} minutes.`,
      resetIn: rateLimit.resetIn
    }), { status: 429 });
  }

  try {
    // Fetch recent blog posts for context
    const blogPosts = await fetchRecentBlogPosts();
    const blogContext = blogPosts.length > 0 
      ? blogPosts.map(post => `- "${post.title}": ${post.excerpt || post.summary || 'Explore the post for details'}`).join('\n')
      : '- Check out alien-signal-blog for coding wisdom and tutorials';
    // Create the alien-themed system prompt
    const systemPrompt = `You are the Alien Code Translator from alien-signal-blog - a cosmic coding mentor who explains programming concepts using space and alien metaphors.

BLOG CONTEXT - Reference these posts when relevant:
${blogContext}

YOUR PERSONALITY:
- You're from a highly advanced alien civilization that views code as universal language
- You use space/alien metaphors: "think of async like receiving transmissions from distant planets"
- You reference alien-signal-blog posts when concepts connect
- Your code comments are themed (👽 🛸 🌌 ⚡ 🔮)
- You explain with cosmic analogies but stay technically accurate
- You're helpful, encouraging, and make learning fun

YOUR TEACHING STYLE:
1. Start with an alien metaphor that makes the concept click
2. Show clean, production-ready code with themed comments
3. Explain key concepts in simple terms
4. Reference related blog posts when relevant
5. Suggest next learning steps

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

🛸 ALIEN INSIGHT:
[Your cosmic metaphor/analogy that explains the concept]

👽 EARTHLING-FRIENDLY CODE:
\`\`\`${language}
[Your complete, working code with alien-themed comments]
\`\`\`

🌌 UNIVERSAL PRINCIPLES:
[Explain the key concepts in simple terms]

🔮 RELATED TRANSMISSIONS:
[Reference 1-2 relevant blog posts if applicable, or say "Explore alien-signal-blog for related cosmic wisdom"]

⚡ NEXT MISSION:
[Suggest what to learn next or how to extend this code]

IMPORTANT RULES:
- Keep code under 50 lines unless complexity demands more
- Use alien emojis (👽 🛸 🌌 ⚡ 🔮 ✨) in comments
- Make metaphors memorable and fun
- Code must be production-ready, not just examples
- Always maintain the alien theme
- Reference blog posts naturally, don't force it`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        ...userHistory,
        {
          role: 'user',
          content: `Help me understand: ${question}\n\nGenerate ${language} code if applicable.`
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse the structured response
    const sections = {
      insight: extractSection(responseText, '🛸 ALIEN INSIGHT:', '👽 EARTHLING-FRIENDLY CODE:'),
      code: extractCodeBlock(responseText),
      principles: extractSection(responseText, '🌌 UNIVERSAL PRINCIPLES:', '🔮 RELATED TRANSMISSIONS:'),
      related: extractSection(responseText, '🔮 RELATED TRANSMISSIONS:', '⚡ NEXT MISSION:'),
      nextMission: extractSection(responseText, '⚡ NEXT MISSION:', null),
      rawResponse: responseText
    };

    return new Response(JSON.stringify({
      success: true,
      ...sections,
      language,
      timestamp: new Date().toISOString()
    }), { status: 200 });

  } catch (error) {
    // Log the error
    logApiError('/api/alien-translator', error, error.status || 500, {
      question: question?.substring(0, 50),
      language,
      errorMessage: error.message,
      errorStack: error.stack
    });

    if (error.status === 429) {
      return new Response(JSON.stringify({
        error: '🛸 Too many transmissions! The cosmic bandwidth is overloaded. Try again in a few moments.'
      }), { status: 429 });
    }

    // Return more detailed error in development
    const isDevelopment = process.env.NODE_ENV === 'development';

    return new Response(JSON.stringify({
      error: isDevelopment
        ? `🛸 Error: ${error.message}`
        : '🛸 Transmission interrupted! Our alien servers encountered an anomaly.',
      ...(isDevelopment && { details: error.message, stack: error.stack?.split('\n').slice(0, 3) })
    }), { status: 500 });
  }
}

// Helper functions
function extractSection(text, startMarker, endMarker) {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return '';
  
  const contentStart = startIndex + startMarker.length;
  const endIndex = endMarker ? text.indexOf(endMarker, contentStart) : text.length;
  
  return text.slice(contentStart, endIndex).trim();
}

function extractCodeBlock(text) {
  const codeMatch = text.match(/```[\w]*\n([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : '';
}

async function fetchRecentBlogPosts() {
  try {
    // Fetch real blog posts from database
    const posts = await getAllPosts();

    // Return the 5 most recent posts
    return posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug
      }));
  } catch (error) {
    // Fallback to static examples if database fails
    return [
      {
        title: "LOG 001: First Signal",
        excerpt: "The beginning of a coding journey—curiosity activated"
      },
      {
        title: "The Labyrinth of Code",
        excerpt: "Navigating the forest of logic where syntax trees grow"
      }
    ];
  }
}

async function trackUsage() {
  // TODO: Implement rate limiting based on your auth system
  // Store in Redis, Vercel KV, or database
  // Example: Track by IP or user ID
}
