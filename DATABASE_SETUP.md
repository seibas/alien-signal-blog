# Database Migration & Setup Guide

## 🚀 Your blog now uses Vercel KV database!

You can now create and edit posts directly from your live website (phone, tablet, any device)!

## Setup Steps:

### 1. Deploy to Vercel (if not already done)
```bash
git add .
git commit -m "Add database support"
git push
```

### 2. Create Vercel KV Database
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "KV" (Redis)
6. Click "Create"
7. Copy the environment variables

### 3. The environment variables will be automatically added to your project

### 4. Migrate Your Posts to Database
Once deployed, visit:
```
https://your-site.vercel.app/api/posts/migrate
```

Send a POST request with:
```json
{
  "secret": "0904",
  "posts": [your posts array from posts.backup.js]
}
```

Or use this curl command:
```bash
curl -X POST https://your-site.vercel.app/api/posts/migrate \
  -H "Content-Type: application/json" \
  -d '{"secret":"0904","posts":[...]}'
```

### 5. Done! 🎉

Now you can:
- Create posts from anywhere (phone, tablet, etc.)
- Edit posts directly on the live site
- No need to push to GitHub for every post
- All changes save to the database instantly

## Testing Locally (Optional)

If you want to test locally with the database:

1. Copy `.env.local.example` to `.env.local`
2. Add your Vercel KV credentials
3. Run `npm run dev`

## Fallback Mode

If the database is unavailable, the site will show the fallback posts from `posts.js`. This ensures your site never goes down!
