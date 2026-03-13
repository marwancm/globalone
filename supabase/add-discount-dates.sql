-- Add discount start and end date columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_start_date TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_end_date TIMESTAMPTZ;

-- Add comment for clarity
COMMENT ON COLUMN products.discount_start_date IS 'Start date for discount period';
COMMENT ON COLUMN products.discount_end_date IS 'End date for discount period - discount auto-expires after this date';
