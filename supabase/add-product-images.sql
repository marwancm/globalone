-- Add images column to products table to support multiple images
-- This column will store an array of image URLs

ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- Update existing products to have their current image_url as the first image in the array
UPDATE products 
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Add comment to the column
COMMENT ON COLUMN products.images IS 'Array of product image URLs';
