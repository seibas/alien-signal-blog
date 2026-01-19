# Alien Signal Blog - Claude Code Workflow

## Quick Commands

### `automated post` or `magic button`
Creates a new blog post with AI-generated metadata.

**How it works:**
1. Ask user for title and content
2. Generate: slug, tags, excerpt, reading time
3. Format content into blocks (text, code, images)
4. Call /api/posts/create to save
5. Confirm success with post URL

### `enhance post [slug]`
Improves an existing post with better tags, excerpt, formatting.

### `translate post [slug]`
Creates Italian version of a post.

---

## Post Structure

```javascript
{
  slug: "url-friendly-slug",           // Auto-generate from title
  title: "Post Title",                  // User provides
  date: "YYYY-MM-DD",                   // Auto: today's date
  readTime: "X min",                    // Auto: calculate from content
  excerpt: "Short description...",      // Auto: first 160 chars or AI summary
  tags: ["tag1", "tag2"],              // Auto: AI suggests based on content
  status: "draft" | "published",        // Default: draft
  blocks: [
    { type: "text", value: "..." },
    { type: "code", language: "javascript", value: "..." },
    { type: "image", src: "/images/...", alt: "..." }
  ]
}
```

---

## Automated Post Workflow

When user says "automated post":

### Step 1: Gather Content
Ask: "What's your post about? Give me:"
- Title (or topic for me to create title)
- Content (raw text, can include code blocks)

### Step 2: Process Content
- Parse content for code blocks (```language ... ```)
- Convert to blocks array
- Detect images (![alt](url))

### Step 3: Generate Metadata
- **slug**: lowercase, hyphens, from title
- **date**: today (YYYY-MM-DD format)
- **readTime**: ~200 words per minute
- **excerpt**: first meaningful paragraph, max 160 chars
- **tags**: extract 3-5 relevant tags from content

### Step 4: Create Post
```bash
curl -X POST http://localhost:3000/api/posts/create \
  -H "Content-Type: application/json" \
  -d '{ ... post data ... }'
```

### Step 5: Confirm
- Show post URL: /blog/[slug]
- Ask if user wants to edit anything

---

## Tag Guidelines
Common tags for this blog:
- Learning: `learning`, `journey`, `beginner`
- Languages: `javascript`, `python`, `react`, `nextjs`
- Topics: `ai`, `web-dev`, `coding`, `tools`
- Meta: `project`, `tutorial`, `tips`

---

## Content Formatting

### Code Blocks
When user writes:
```
Here's some code:
\`\`\`javascript
const x = 1;
\`\`\`
```

Convert to:
```javascript
{
  blocks: [
    { type: "text", value: "Here's some code:" },
    { type: "code", language: "javascript", value: "const x = 1;" }
  ]
}
```

### Images
When user includes `![alt](url)`, convert to image block:
```javascript
{ type: "image", src: "url", alt: "alt" }
```

---

## API Reference

### Create Post
```
POST /api/posts/create
Body: { slug, title, date, readTime, tags, excerpt, blocks }
```

### Update Post
```
POST /api/posts/update
Body: { slug, ...fields to update }
```

### Enhance Post (AI)
```
POST /api/posts/enhance
Body: { content, title? }
Response: { slug, tags, excerpt, readTime }
```

---

## Color Theme
- Primary: Green (#00ff8c)
- Accent: Orange (#ff9100)
- Background: Dark (#0a0a0a)
