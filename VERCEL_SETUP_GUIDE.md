# 🎯 EXACT LOCATION: How to Add Environment Variables in Vercel

## Step-by-Step with Exact Locations:

### STEP 1: Go to Vercel Dashboard
1. Open browser: https://vercel.com/dashboard
2. You'll see a list of your projects

### STEP 2: Find Your Project
1. Look for your blog project (it might be called something like):
   - `alien-signal-blog`
   - `alien-signal-blog-nextjs-js`
   - Or similar name
2. **Click on the project name** (not the URL, the project card itself)

### STEP 3: Navigate to Settings
1. You'll see tabs at the top:
   ```
   [Overview] [Deployments] [Analytics] [Logs] [Settings] [...]
   ```
2. **Click on "Settings"** tab

### STEP 4: Find Environment Variables Section
1. On the left sidebar, you'll see a menu like:
   ```
   General
   Domains
   Git
   → Environment Variables  ← CLICK HERE!
   Deployment Protection
   Security
   Advanced
   ```
2. **Click on "Environment Variables"**

### STEP 5: Add Each Variable

You'll see a form with these fields:

```
┌─────────────────────────────────────────┐
│ Name:  [________________]               │
│                                         │
│ Value: [________________]               │
│                                         │
│ Environments:                           │
│ ☑ Production                           │
│ ☑ Preview                              │
│ ☑ Development                          │
│                                         │
│        [Add]  [Cancel]                  │
└─────────────────────────────────────────┘
```

**For each variable below, do this:**
1. Type the **Name** in the "Name" field
2. Type/paste the **Value** in the "Value" field
3. **Check all three boxes**: Production, Preview, Development
4. Click the **"Add"** button
5. Repeat for next variable

---

## 📝 VARIABLES TO ADD (Copy/Paste These):

### Variable 1:
```
Name:  ADMIN_PASSWORD
Value: 0904
```
✅ Check: Production, Preview, Development  
Click: **Add**

---

### Variable 2:
```
Name:  JWT_SECRET
Value: 239d7bde405a0596116055076cf29aa875f27b8dd98ce27650f3eade74075c23
```
✅ Check: Production, Preview, Development  
Click: **Add**

---

### Variable 3:
```
Name:  UPSTASH_REDIS_REST_URL
Value: https://quiet-owl-32587.upstash.io
```
✅ Check: Production, Preview, Development  
Click: **Add**

---

### Variable 4:
```
Name:  UPSTASH_REDIS_REST_TOKEN
Value: AX9LAAIncDEyMGVmZDVlY2I4OGI0ZDUzOGNjNzQ0ZGQ2MTI2YTExOHAxMzI1ODc
```
✅ Check: Production, Preview, Development  
Click: **Add**

---

### Variable 5 (Optional - for AI features):
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-api03-[YOUR-API-KEY-HERE]
```
✅ Check: Production, Preview, Development  
Click: **Add**

*Note: Use your actual Anthropic API key from your account*

---

## ✅ AFTER ADDING ALL VARIABLES

You should see them listed like this:

```
┌────────────────────────────────────────────────────┐
│ ADMIN_PASSWORD                                     │
│ •••• (Hidden)                                      │
│ Production, Preview, Development                   │
│ [Edit] [Delete]                                    │
├────────────────────────────────────────────────────┤
│ JWT_SECRET                                         │
│ •••• (Hidden)                                      │
│ Production, Preview, Development                   │
│ [Edit] [Delete]                                    │
├────────────────────────────────────────────────────┤
│ UPSTASH_REDIS_REST_URL                            │
│ https://quiet-owl-32587.upstash.io                │
│ Production, Preview, Development                   │
│ [Edit] [Delete]                                    │
├────────────────────────────────────────────────────┤
│ UPSTASH_REDIS_REST_TOKEN                          │
│ •••• (Hidden)                                      │
│ Production, Preview, Development                   │
│ [Edit] [Delete]                                    │
├────────────────────────────────────────────────────┤
│ ANTHROPIC_API_KEY                                  │
│ •••• (Hidden)                                      │
│ Production, Preview, Development                   │
│ [Edit] [Delete]                                    │
└────────────────────────────────────────────────────┘
```

---

## 🚀 STEP 6: Trigger Redeployment

After adding all variables, you need to redeploy:

**Option A - From Deployments Tab:**
1. Click "Deployments" tab (top of page)
2. Find the latest deployment
3. Click the **three dots (...)** on the right
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm

**Option B - From Command Line:**
```powershell
vercel --prod
```

**Option C - Automatic:**
- Push any change to GitHub
- Vercel will auto-deploy with new variables

---

## 🔍 VERIFY IT WORKED

After redeployment:

1. **Go to your live site:** https://your-project.vercel.app
2. **Test admin login:** https://your-project.vercel.app/admin
3. **Enter password:** `0904`
4. **Expected:** You should be able to log in! ✅

---

## ❓ TROUBLESHOOTING

### "I don't see Environment Variables in the sidebar"
- Make sure you clicked on **Settings** tab first
- Scroll down the left sidebar
- It should be there between "Git" and "Deployment Protection"

### "I can't find my project"
- Go to: https://vercel.com
- Click your profile picture (top right)
- Click "Dashboard"
- Look for project with "alien" or "blog" in the name

### "The Add button is grayed out"
- Make sure you filled in both Name AND Value
- Make sure at least one environment checkbox is checked
- Try clicking in the Value field and pressing Enter

### "After adding variables, site still doesn't work"
- Did you redeploy? (Step 6 is required!)
- Variables only take effect after redeployment
- Check the Deployments tab to see if build succeeded

---

## 📸 VISUAL REFERENCE

The path looks like this:

```
Vercel Dashboard
    ↓
Your Project (click project card)
    ↓
Settings tab (top)
    ↓
Environment Variables (left sidebar)
    ↓
[Add form appears]
    ↓
Fill Name + Value + Check boxes
    ↓
Click Add button
    ↓
Repeat for each variable
    ↓
Redeploy (Deployments tab)
```

---

## ✅ CHECKLIST

- [ ] Opened Vercel dashboard
- [ ] Found my project
- [ ] Clicked Settings tab
- [ ] Clicked Environment Variables (left sidebar)
- [ ] Added ADMIN_PASSWORD
- [ ] Added JWT_SECRET
- [ ] Added UPSTASH_REDIS_REST_URL
- [ ] Added UPSTASH_REDIS_REST_TOKEN
- [ ] Added ANTHROPIC_API_KEY (optional)
- [ ] All variables show "Production, Preview, Development"
- [ ] Triggered redeployment
- [ ] Waited for deployment to complete (green checkmark)
- [ ] Tested admin login on live site

---

**That's it!** 🎉

The exact location is:
**Vercel Dashboard → Your Project → Settings Tab → Environment Variables (sidebar)**

Need more help? Let me know what you see on your screen!
