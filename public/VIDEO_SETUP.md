# UFO Video Setup for Post Cards

## 📹 Add Your UFO Animation Video

To enable video backgrounds on post cards without featured images, add your video file to this folder.

### Required:

**File:** `ufo-animation.mp4`  
**Location:** `/public/ufo-animation.mp4`

---

## 🎬 Video Requirements:

### Optimal Specs:
- **Format:** MP4 (H.264 codec)
- **Resolution:** 800x400px or 1200x600px
- **Duration:** 2-5 seconds (loops seamlessly)
- **File Size:** Under 500KB (preferably 200-300KB)
- **Bitrate:** 500-1000 kbps
- **Frame Rate:** 24-30 fps
- **Audio:** None (remove audio track)

### Why These Specs?
- ✅ Small file size = fast loading
- ✅ Short duration = seamless loop
- ✅ No audio = autoplay works
- ✅ Low bitrate = mobile-friendly

---

## 🛠️ How to Optimize Your Video:

### Option 1: Online Tools (Easiest)
1. Go to https://www.freeconvert.com/video-compressor
2. Upload your UFO video
3. Set target size to 300KB
4. Download compressed version
5. Rename to `ufo-animation.mp4`
6. Place in `/public` folder

### Option 2: HandBrake (Free Software)
1. Download HandBrake: https://handbrake.fr/
2. Open your video
3. Settings:
   - Preset: "Web/Email"
   - Video Codec: H.264
   - Quality: RF 28-32
   - Frame Rate: 24-30fps
4. Export as `ufo-animation.mp4`
5. Place in `/public` folder

### Option 3: FFmpeg (Command Line)
```bash
ffmpeg -i input.mp4 -vf scale=800:400 -c:v libx264 -crf 28 -preset slow -an ufo-animation.mp4
```

---

## 📂 File Structure:

```
public/
  ├── ufo-animation.mp4  ← Your video goes here!
  ├── images/
  │   └── avatar.jpg
  └── VIDEO_SETUP.md     ← This file
```

---

## ✅ After Adding Video:

1. Place `ufo-animation.mp4` in `/public` folder
2. Restart your dev server: `npm run dev`
3. Visit `/blog` page
4. Post cards without images will show your video! 🛸

---

## 🎨 How It Works:

### Posts WITH Images:
```
┌─────────────┐
│  [IMAGE]    │ ← Your uploaded image
├─────────────┤
│   Title     │
└─────────────┘
```

### Posts WITHOUT Images:
```
┌─────────────┐
│  [VIDEO]    │ ← UFO animation looping
│     🛸      │
├─────────────┤
│   Title     │
└─────────────┘
```

---

## 🚀 Features:

- ✅ **Lazy Loading:** Video only loads when card is visible
- ✅ **Fallback:** Shows gradient + SVG icon while video loads
- ✅ **Autoplay:** Video plays automatically (muted)
- ✅ **Loop:** Seamless infinite loop
- ✅ **Mobile Optimized:** Works on iOS and Android
- ✅ **Performance:** Minimal impact on page speed

---

## 🐛 Troubleshooting:

### Video Not Showing?
1. Check file name is exactly: `ufo-animation.mp4`
2. Check file is in `/public` folder (not `/public/images`)
3. Restart dev server
4. Clear browser cache (Ctrl + Shift + R)

### Video Not Playing?
1. Ensure video has `muted` attribute (required for autoplay)
2. Check video codec is H.264
3. Try a different browser
4. Check browser console for errors

### File Too Large?
1. Compress video more (see optimization section)
2. Reduce resolution to 640x320px
3. Shorten duration to 3 seconds
4. Increase CRF value (lower quality = smaller size)

---

## 💡 Pro Tips:

### Make a Perfect Loop:
- First frame = Last frame
- Smooth transition at loop point
- No sudden jumps

### Best Video Content:
- UFO flying/floating
- Subtle animation (not too fast)
- Space/alien theme
- Dark background (matches blog theme)

### Where to Find UFO Videos:
- Pixabay: https://pixabay.com/videos/
- Pexels: https://www.pexels.com/videos/
- Videvo: https://www.videvo.net/
- Create your own with Blender/After Effects

---

## 📊 Performance Impact:

With proper optimization:
- First Load: +200-300KB
- Lazy Loading: Only loads when visible
- Caching: Loaded once, reused for all cards
- Mobile Data: Minimal impact

**Lighthouse Score:** Should remain 90+ with optimized video

---

## 🎯 Current Status:

- [x] Code is ready
- [x] CSS is configured
- [x] Lazy loading implemented
- [x] Fallback system active
- [ ] **Video file needed!** ← Add `ufo-animation.mp4` here

---

## 📞 Need Help?

If you need help:
1. Check file name spelling
2. Verify file format (must be .mp4)
3. Test video plays in browser (drag into browser window)
4. Check browser console for errors

---

**Once you add the video, your blog will look amazing with animated backgrounds!** 🚀✨
