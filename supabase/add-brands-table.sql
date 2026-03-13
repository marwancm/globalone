-- Create brands table for managing trusted brands/logos
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public can view active brands
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (active = true);

-- Admins can manage brands
CREATE POLICY "Admins can insert brands" ON brands FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update brands" ON brands FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete brands" ON brands FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(active);
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands(sort_order);

-- Insert some sample brands
INSERT INTO brands (name_ar, name_en, sort_order) VALUES
  ('إل جي', 'LG', 1),
  ('سامسونج', 'Samsung', 2),
  ('بوش', 'Bosch', 3),
  ('سوني', 'Sony', 4),
  ('أبل', 'Apple', 5),
  ('فيليبس', 'Philips', 6);
