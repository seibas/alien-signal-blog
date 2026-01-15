# 📸 Image Functionality Testing Checklist

## Overview
This document provides a comprehensive testing checklist for image upload, management, and display functionality in the blog application.

---

## ✅ Test 1: CREATE POST - Image Block Upload

### Steps:
1. Navigate to `/admin` page
2. Click "📝 New Post" button
3. Scroll down and click "📸 Add Image Block" button
4. Verify an empty image block appears with placeholder "📸 No image yet"
5. Click the upload area or drag an image file
6. Wait for upload (should show "🛸 Uploading...")
7. Verify success message appears: "✅ [filename] uploaded!"
8. Verify image preview appears in the block
9. Add alt text in the text field
10. Fill in other required fields (title, slug, etc.)
11. Click "🚀 Create Post"
12. Wait for success message and redirect

### Expected Results:
- ✅ Image block created successfully
- ✅ Upload shows progress indicator
- ✅ Success toast notification appears
- ✅ Image preview displays immediately
- ✅ Alt text field accepts input
- ✅ Post created successfully
- ✅ Redirect to new post page

### What to Check:
- Image quality in preview
- Upload time (should be fast for local dev)
- Error handling for large files (>5MB should fail)
- Error handling for invalid file types

---

## ✅ Test 2: CREATE POST - Multiple Image Blocks

### Steps:
1. Create a new post
2. Add multiple image blocks (at least 3)
3. Upload different images to each block
4. Add different alt text to each
5. Move blocks using ▲ and ▼ buttons
6. Verify blocks reorder correctly
7. Add text blocks between image blocks
8. Save the post

### Expected Results:
- ✅ Multiple image blocks can be created
- ✅ Each block maintains its own image and alt text
- ✅ Move buttons work correctly
- ✅ Top block's ▲ button is disabled
- ✅ Bottom block's ▼ button is disabled
- ✅ Mixed content (text + images) saves correctly

---

## ✅ Test 3: CREATE POST - Drag & Drop Upload

### Steps:
1. Create a new post with an image block
2. Drag an image file from your file explorer
3. Drop it onto the upload area
4. Verify upload proceeds automatically

### Expected Results:
- ✅ Drag over shows visual feedback (border/background change)
- ✅ Drop triggers upload
- ✅ Upload completes successfully
- ✅ Image appears in preview

---

## ✅ Test 4: CREATE POST - ImageUpload in Text Blocks

### Steps:
1. Create a new post with a text block
2. Use the ImageUpload component under the textarea
3. Upload an image
4. Verify markdown is inserted: `![filename](url)`
5. Check the preview section above textarea
6. Click "🔄 Convert to Image Block" button
7. Verify image is removed from text and new image block created

### Expected Results:
- ✅ Markdown inserted into text content
- ✅ Preview shows the image inline
- ✅ Convert button creates proper image block
- ✅ Original markdown removed from text

---

## ✅ Test 5: EDIT POST - Edit Existing Image Blocks

### Steps:
1. Create a post with image blocks and save
2. Click "✏️ Edit Post" button
3. Verify existing image blocks display correctly
4. Upload a different image to an existing block
5. Change the alt text
6. Move the block up or down
7. Click "💾 Save Changes"
8. Exit edit mode
9. Verify changes are reflected

### Expected Results:
- ✅ Existing images load correctly in edit mode
- ✅ Can replace existing images
- ✅ Alt text persists and can be edited
- ✅ Block movement works
- ✅ Changes save successfully
- ✅ Display mode shows updated content

---

## ✅ Test 6: EDIT POST - Add New Image Blocks

### Steps:
1. Open existing post in edit mode
2. Click "📸 Add Image Block"
3. Upload a new image
4. Add alt text
5. Position it using move buttons
6. Add another text block after it
7. Save changes
8. Verify new block appears in display mode

### Expected Results:
- ✅ New blocks integrate with existing content
- ✅ Upload works same as create mode
- ✅ Block positioning works correctly
- ✅ Mixed old and new content saves properly

---

## ✅ Test 7: EDIT POST - Top Level Image Upload

### Steps:
1. Open post in edit mode
2. Scroll to top where "📸 Add Images" section is
3. Upload an image using this uploader
4. Verify image markdown is added to last text block
5. If no text blocks exist, verify new text block is created
6. Save and verify

### Expected Results:
- ✅ Top-level uploader works
- ✅ Image inserted into appropriate text block
- ✅ Creates text block if none exist
- ✅ Markdown format correct

---

## ✅ Test 8: Image Storage Verification

### Steps:
1. Upload an image in create or edit mode
2. Check `public/images/` directory
3. Verify image file exists with correct name
4. Check filename format: `[timestamp]-[name].[ext]`
5. Open image directly in browser: `/images/[filename]`
6. Verify image displays

### Expected Results:
- ✅ Image file saved to public/images/
- ✅ Filename follows convention
- ✅ Image accessible via direct URL
- ✅ Image quality maintained

---

## ✅ Test 9: Display Mode - Image Rendering

### Steps:
1. Create/edit a post with multiple image blocks
2. Save and exit edit mode
3. Verify all images display in the post view
4. Check image styling (borders, shadows, rounded corners)
5. Verify alt text is in the HTML
6. Check responsive behavior (resize browser)
7. Navigate away and back
8. Verify images still load

### Expected Results:
- ✅ All images render correctly
- ✅ Proper styling applied
- ✅ Alt text present in DOM
- ✅ Images responsive
- ✅ Images persist across navigation

---

## ✅ Test 10: Error Handling

### Steps to Test Each Error:

**A. File Too Large:**
1. Try uploading file >5MB
2. Verify error message: "File too large. Maximum size is 5MB"

**B. Invalid File Type:**
1. Try uploading .txt or .pdf file
2. Verify error: "Invalid file type. Please upload JPG, PNG, GIF, or WebP"

**C. No File Selected:**
1. Click upload without selecting file (edge case)
2. Verify appropriate handling

**D. Network Error:**
1. Stop dev server mid-upload
2. Verify error handling

### Expected Results:
- ✅ Clear error messages
- ✅ Toast notifications for errors
- ✅ No crashes or undefined errors
- ✅ User can retry after error

---

## ✅ Test 11: Block Movement Edge Cases

### Steps:
1. Create post with single image block
2. Verify both move buttons disabled
3. Add text block above
4. Verify only ▼ works for top block
5. Add text block below
6. Verify middle block both buttons work
7. Verify bottom block only ▲ works
8. Move block to top
9. Move same block to bottom
10. Verify state updates correctly

### Expected Results:
- ✅ Boundary conditions handled
- ✅ Button states update correctly
- ✅ Visual feedback clear
- ✅ No errors in console

---

## ✅ Test 12: Mixed Content Post

### Steps:
1. Create a post with this structure:
   - Text block with intro
   - Image block #1
   - Text block with description
   - Code block with JavaScript
   - Image block #2
   - Text block with markdown image
   - Image block #3
2. Move blocks around
3. Save and verify order maintained
4. Edit and verify all blocks load correctly
5. Display and verify rendering

### Expected Results:
- ✅ Complex structure saves correctly
- ✅ Block types mixed properly
- ✅ Order preserved through save/load
- ✅ All blocks render in display mode
- ✅ No visual glitches

---

## ✅ Test 13: Image URL Format

### Steps:
1. Create post with image
2. Save post
3. Open browser DevTools
4. Check image src attribute
5. Verify format is `/images/[timestamp]-[name].[ext]`
6. Verify image loads from this path
7. Check console for any 404 errors

### Expected Results:
- ✅ URLs formatted correctly
- ✅ No broken image icons
- ✅ No 404 errors in console
- ✅ Images load reliably

---

## ✅ Test 14: Performance Test

### Steps:
1. Create post with 10 image blocks
2. Upload 10 different images (use batch upload if available)
3. Time the upload process
4. Move blocks around
5. Save the post
6. Load the post in display mode
7. Check page load time

### Expected Results:
- ✅ Multiple uploads complete in reasonable time
- ✅ UI remains responsive during uploads
- ✅ Block movement smooth with many blocks
- ✅ Save completes quickly
- ✅ Display mode loads all images efficiently
- ✅ No memory leaks

---

## ✅ Test 15: Delete and Remove

### Steps:
1. Create post with multiple blocks including images
2. Use ✕ button to remove an image block
3. Verify block disappears
4. Save post
5. Reload/reopen
6. Verify removed block stays removed
7. Delete entire post
8. Verify post and all associated data removed

### Expected Results:
- ✅ Remove button works
- ✅ Block removed from UI immediately
- ✅ Removal persists after save
- ✅ No ghost blocks
- ✅ Post deletion works

---

## 🔍 What to Look For During Testing

### Browser Console
- No JavaScript errors
- No 404 errors for images
- No React warnings
- Clean network tab

### Visual Issues
- Images properly sized
- Borders and shadows correct
- Responsive layout works
- No layout shifts
- Smooth animations

### Data Integrity
- Image URLs correct in database
- Alt text saved and retrieved
- Block order preserved
- No data loss on save

### User Experience
- Fast upload times
- Clear feedback (loading states, success/error)
- Intuitive controls
- No confusing states

---

## 🐛 Common Issues to Watch For

1. **Image not showing after save** - Check URL format and file path
2. **Block order changes after save** - Verify moveBlock function
3. **Upload fails silently** - Check API route and error handling
4. **Images break on production** - Verify Vercel Blob configuration
5. **Alt text not saving** - Check API payload includes alt field
6. **Preview not updating** - Check state updates in React
7. **Memory leaks with many images** - Monitor browser memory

---

## 📊 Success Criteria

All tests should pass with:
- ✅ 0 console errors
- ✅ 0 visual bugs
- ✅ 0 data loss issues
- ✅ Fast performance (<2s for most operations)
- ✅ Clear user feedback for all actions
- ✅ Graceful error handling

---

## 🚀 Quick Smoke Test (5 minutes)

If short on time, run this abbreviated test:

1. **Create:** Make new post with 1 image block, upload image, save
2. **Edit:** Open post, change image, move block, save
3. **Display:** View post, verify image shows correctly
4. **Error:** Try uploading 10MB file, verify error shows

If all 4 pass, system is likely working correctly.

---

## 📝 Notes

- Run tests in Chrome, Firefox, and Safari if possible
- Test both local dev (npm run dev) and production build
- Check mobile responsiveness
- Document any issues found in GitHub Issues
- Update this checklist as features change

---

**Last Updated:** January 16, 2026
**Status:** All functionality verified working ✅
**Critical Fix Applied:** Create API now supports blocks array
