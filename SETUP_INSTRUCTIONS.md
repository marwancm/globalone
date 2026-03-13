# Setup Instructions for GlobalOne

## Database Migrations Required

You need to run the following SQL files in your Supabase SQL Editor to enable all new features:

### 1. Add Multiple Images Support for Products
Run: `supabase/add-product-images.sql`

This adds an `images` column to the products table to support multiple product images.

### 2. Add Brands Management
Run: `supabase/add-brands-table.sql`

This creates the brands table for managing trusted brand logos and information.

## Steps to Apply Changes

1. **Go to your Supabase Dashboard**: https://supabase.com
2. **Navigate to SQL Editor**
3. **Run each SQL file** in the order listed above:
   - Copy the contents of `supabase/add-product-images.sql`
   - Paste and run in SQL Editor
   - Copy the contents of `supabase/add-brands-table.sql`
   - Paste and run in SQL Editor

## New Features Added

### ✅ Logo & Branding
- Logo added to header (`/logo.png`)
- Favicon updated (`/favicon.png`)
- Logo added to footer

### ✅ Social Media
- Facebook link added to footer: https://www.facebook.com/profile.php?id=61584064901025&locale=ar_AR

### ✅ Multiple Product Images
- Products now support multiple images
- Image gallery with thumbnails on product detail page
- Dashboard allows uploading multiple images per product
- Existing images can be removed individually

### ✅ Brands Management
- New dashboard section: `/dashboard/brands`
- Add/edit/delete brands with logos
- Brands displayed on homepage
- Brands can be activated/deactivated
- Sort order control

## How to Use New Features

### Managing Product Images
1. Go to Dashboard → Manage Products
2. Edit a product
3. Upload multiple images using the file input
4. Existing images show as thumbnails with delete buttons
5. First image is used as the main product image

### Managing Brands
1. Go to Dashboard → Manage Brands
2. Add new brands with Arabic/English names
3. Upload brand logos (optional)
4. Set sort order for display
5. Toggle active/inactive status
6. Brands appear on homepage automatically

## Important Notes

- Make sure to run the SQL migrations before using the new features
- The `images` column stores an array of image URLs
- Brands with no logo will display their name as text
- All images use the Supabase storage helper for proper URL formatting

## Troubleshooting

### 404 Error: brands table not found
**Error**: `Failed to load resource: the server responded with a status of 404` for `/rest/v1/brands`

**Solution**: You haven't run the brands migration yet. Run `supabase/add-brands-table.sql` in your Supabase SQL Editor.

### Performance Issues
If the site feels slow:
1. Check your internet connection
2. Ensure Supabase project is in the same region as your users
3. The development server is slower than production - build and deploy for better performance
4. Run `npm run build` to check for any build-time optimizations

### Lock Warning in Console
**Warning**: `Lock "lock:sb-..." was not released within 5000ms`

This is a development-only warning caused by React Strict Mode. It won't appear in production and doesn't affect functionality.
