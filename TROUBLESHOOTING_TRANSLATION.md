# 🔧 Italian Translation - Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## Issue 1: Language Switcher Not Visible

### Symptoms:
- Can't find 🇺🇸/🇮🇹 buttons in header
- Navigation looks the same as before

### Solutions:

**Step 1: Hard Refresh Browser**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Step 2: Clear Browser Cache**
```
Chrome: F12 → Application → Clear Storage → Clear site data
Firefox: Ctrl + Shift + Delete
Safari: Cmd + Option + E
```

**Step 3: Restart Dev Server**
```bash
# Stop server (Ctrl + C)
npm run dev
```

**Step 4: Verify Import**
Check `components/SiteHeader.jsx`:
```jsx
import LanguageSwitcher from "./LanguageSwitcher";
// Should be at line 4
```

---

## Issue 2: "Translation Failed" Error

### Symptoms:
- Click 🇮🇹 flag
- See loading indicator
- Error message appears: "⚠️ Translation failed"
- Content stays in English

### Solutions:

**Step 1: Check API Key**
```bash
# Open .env.local
# Verify this line exists:
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx...
```

**Step 2: Verify API Key is Valid**
```bash
# Test API directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**Step 3: Check API Credit**
- Go to: https://console.anthropic.com/settings/billing
- Verify you have available credit

**Step 4: Check Browser Console**
```
F12 → Console tab
Look for error messages
```

Common errors:
- `401 Unauthorized` → API key invalid
- `429 Too Many Requests` → Rate limited
- `500 Internal Server Error` → Check Vercel logs

**Step 5: Test API Route**
```bash
# Open: http://localhost:3000/api/translate
# Should return: {"error":"Method not allowed"}

# Test with correct method:
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "content": [{"type":"text","value":"Test"}],
    "targetLanguage": "it",
    "postTitle": "Test"
  }'
```

---

## Issue 3: Translation Never Completes

### Symptoms:
- Click 🇮🇹 flag
- Loading indicator shows forever
- "🛸 Translating to Italian..." never goes away
- Page doesn't update

### Solutions:

**Step 1: Check Network Tab**
```
F12 → Network tab
Filter: Fetch/XHR
Look for /api/translate request
Check status code and response
```

**Step 2: Check Internet Connection**
```bash
# Test connection to Anthropic
ping api.anthropic.com
```

**Step 3: Increase Timeout (if slow network)**
Edit `hooks/useTranslation.js`:
```javascript
// Add timeout to fetch
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s

const response = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... }),
  signal: controller.signal
});

clearTimeout(timeoutId);
```

**Step 4: Check for Large Posts**
```javascript
// In browser console:
console.log(JSON.stringify(post.blocks).length);
// If > 100KB, post might be too large
```

---

## Issue 4: Cache Not Working

### Symptoms:
- Every translation takes 2-5 seconds (even repeated ones)
- No instant loads on re-translation
- localStorage seems empty

### Solutions:

**Step 1: Check localStorage**
```javascript
// Browser console (F12)
localStorage.getItem('blog_language'); // Should return 'en' or 'it'
localStorage.getItem('post_first-signal_it'); // Should return JSON

// List all cached posts
Object.keys(localStorage).filter(key => key.startsWith('post_'));
```

**Step 2: Check Browser Settings**
- Settings → Privacy → Ensure "Allow cookies" is enabled
- Some browsers block localStorage in incognito mode
- Browser extensions (ad blockers) might interfere

**Step 3: Test localStorage Manually**
```javascript
// Set a test value
localStorage.setItem('test', 'works');

// Try to read it
localStorage.getItem('test'); // Should return 'works'

// If returns null, localStorage is blocked
```

**Step 4: Clear and Retry**
```javascript
// Clear all translation cache
Object.keys(localStorage)
  .filter(key => key.startsWith('post_'))
  .forEach(key => localStorage.removeItem(key));

// Try translating again
```

---

## Issue 5: Code Blocks Getting Translated

### Symptoms:
- JavaScript/Python code appears in Italian
- Function names translated (e.g., `funzione` instead of `function`)
- Code is broken

### Solutions:

**Step 1: Check Translation Prompt**
Edit `app/api/translate/route.js` line ~30:
```javascript
content: `You are a professional Italian translator...

CRITICAL RULES:
1. Translate ALL text content to natural, fluent Italian
2. Do NOT translate code blocks - keep code exactly as is  ← CHECK THIS
3. Do NOT translate technical terms like: React, JavaScript...
...`
```

**Step 2: Make Prompt More Explicit**
```javascript
2. Do NOT translate code blocks - keep ALL code EXACTLY as written
3. NEVER translate variable names, function names, or any code syntax
4. Code blocks must remain 100% in original language
```

**Step 3: Add Code Detection**
```javascript
// Before sending to Claude, mark code blocks explicitly
const markedContent = content.map(block => {
  if (block.type === 'code') {
    return {
      ...block,
      value: `<<<DO_NOT_TRANSLATE>>>${block.value}<<<DO_NOT_TRANSLATE>>>`
    };
  }
  return block;
});
```

---

## Issue 6: Mobile Menu Doesn't Show Switcher

### Symptoms:
- Desktop: switcher visible ✅
- Mobile: switcher missing ❌
- Mobile menu opens but no 🇺🇸/🇮🇹

### Solutions:

**Step 1: Check Mobile Menu Code**
Verify in `components/SiteHeader.jsx` around line 130:
```jsx
<nav className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
  <div className="nav-mobile-links">
    ...
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <LanguageSwitcher />  ← THIS SHOULD BE HERE
    </div>
    ...
  </div>
</nav>
```

**Step 2: Test Mobile View**
```
F12 → Toggle device toolbar (Ctrl + Shift + M)
Select "iPhone SE" or "Pixel 7 Pro"
Open mobile menu (☰ button)
Scroll through menu
```

**Step 3: Check CSS**
Verify `components/LanguageSwitcher.css`:
```css
@media (max-width: 768px) {
  .language-switcher {
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
  }
}
```

---

## Issue 7: TypeScript Errors (if using TypeScript)

### Symptoms:
- Red underlines in VS Code
- Build fails with type errors
- Errors about missing types

### Solutions:

**Step 1: Create Type Definitions**
Create `types/translation.d.ts`:
```typescript
export interface TranslationBlock {
  type: 'text' | 'code' | 'image';
  value?: string;
  text?: string;
  code?: string;
  language?: string;
  src?: string;
  alt?: string;
}

export interface UseTranslationReturn {
  language: 'en' | 'it';
  displayContent: TranslationBlock[] | null;
  displayTitle: string | null;
  isTranslating: boolean;
  error: string | null;
}
```

**Step 2: Add Types to Hook**
```typescript
// hooks/useTranslation.ts
export function useTranslation(
  postSlug: string | undefined,
  originalContent: TranslationBlock[],
  originalTitle: string
): UseTranslationReturn {
  // ... existing code
}
```

---

## Issue 8: Vercel Deployment Fails

### Symptoms:
- Builds fine locally
- Vercel deployment fails
- Error about environment variables

### Solutions:

**Step 1: Add Environment Variables to Vercel**
```
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: ANTHROPIC_API_KEY = sk-ant-api03-xxxxx...
5. Redeploy
```

**Step 2: Check Build Logs**
```
Vercel Dashboard → Deployments → Failed deployment → View logs
Look for specific error messages
```

**Step 3: Test API Route in Production**
```bash
# After deployment
curl -X POST https://your-site.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"content":[{"type":"text","value":"Test"}],"targetLanguage":"it","postTitle":"Test"}'
```

---

## Issue 9: Memory Leak Warning

### Symptoms:
- Console warning: "Can't perform a React state update on unmounted component"
- Happens when navigating away during translation

### Solutions:

**Step 1: Add Cleanup to Hook**
Edit `hooks/useTranslation.js`:
```javascript
useEffect(() => {
  let isMounted = true;
  
  const loadCachedTranslation = () => {
    // existing code...
  };
  
  const handleLanguageChange = (event) => {
    if (!isMounted) return;  // ← ADD THIS
    // existing code...
  };
  
  window.addEventListener('languageChanged', handleLanguageChange);
  
  return () => {
    isMounted = false;  // ← ADD THIS
    window.removeEventListener('languageChanged', handleLanguageChange);
  };
}, [postSlug]);
```

---

## Issue 10: Rate Limiting Errors

### Symptoms:
- Error: "429 Too Many Requests"
- Can't translate after several attempts
- API stops responding

### Solutions:

**Step 1: Implement Rate Limiting**
Create `lib/rateLimiter.js` (you may already have this):
```javascript
const rateLimit = new Map();

export function checkRateLimit(identifier, limit = 5, window = 60000) {
  const now = Date.now();
  const userRequests = rateLimit.get(identifier) || [];
  
  // Remove old requests outside window
  const recentRequests = userRequests.filter(time => now - time < window);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);
  return true; // OK to proceed
}
```

**Step 2: Add to API Route**
```javascript
// app/api/translate/route.js
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip, 10, 60000)) {  // 10 requests per minute
    return Response.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429 }
    );
  }
  
  // ... rest of code
}
```

---

## 🆘 Still Having Issues?

### Debugging Checklist:

- [ ] Restart dev server (`npm run dev`)
- [ ] Hard refresh browser (Ctrl + Shift + R)
- [ ] Clear localStorage (`localStorage.clear()`)
- [ ] Clear browser cache
- [ ] Check browser console (F12)
- [ ] Check Network tab (F12)
- [ ] Verify `.env.local` exists and has API key
- [ ] Test API key directly with curl
- [ ] Check Anthropic API status page
- [ ] Try in incognito mode
- [ ] Try different browser
- [ ] Check Vercel function logs (if deployed)

### Get Help:

1. **Check Logs**: Browser console + Network tab
2. **Document Error**: Screenshot + error message
3. **Test Minimal Case**: Does API work with simple "Hello" translation?
4. **Isolate Problem**: Is it frontend or backend?

### Emergency Rollback:

If feature breaks production:
```bash
# Remove language switcher from header
git checkout HEAD -- components/SiteHeader.jsx

# Remove translation hook from blog post
git checkout HEAD -- components/EditableBlogPost.jsx

# Commit and push
git commit -m "Temporarily disable translations"
git push
```

---

## 📊 Health Check Commands

Run these to verify everything works:

```javascript
// 1. Check localStorage
console.log('Language:', localStorage.getItem('blog_language'));
console.log('Cached posts:', Object.keys(localStorage).filter(k => k.startsWith('post_')));

// 2. Test translation hook
// (In blog post page console)
console.log('Current language:', window.language);
console.log('Is translating:', window.isTranslating);

// 3. Clear all translations
Object.keys(localStorage)
  .filter(key => key.startsWith('post_'))
  .forEach(key => localStorage.removeItem(key));
console.log('Cache cleared!');

// 4. Force re-translation
localStorage.removeItem('post_' + currentSlug + '_it');
window.dispatchEvent(new CustomEvent('languageChanged', { detail: 'it' }));
```

---

**Still stuck?** Check the detailed documentation in `ITALIAN_TRANSLATION_IMPLEMENTATION.md`
