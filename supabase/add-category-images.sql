-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing categories with placeholder or default images if needed
COMMENT ON COLUMN categories.image_url IS 'Category image URL from Supabase storage';
