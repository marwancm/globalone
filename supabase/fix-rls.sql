-- ============================================
-- FIX RLS + Add Hero Slides Table
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Hero Slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  subtitle_ar TEXT DEFAULT '',
  subtitle_en TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  link TEXT DEFAULT '/shop',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Step 1: Create helper function (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Drop ALL old policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Step 3: Create NEW policies using is_admin() function (no recursion)

-- Users policies
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_select_admin" ON users FOR SELECT USING (is_admin());
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_update_admin" ON users FOR UPDATE USING (is_admin());
CREATE POLICY "users_delete_admin" ON users FOR DELETE USING (is_admin());

-- Categories policies (public read, admin write)
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "categories_update_admin" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE USING (is_admin());

-- Products policies (public read, admin write)
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete_admin" ON products FOR DELETE USING (is_admin());

-- Orders policies
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_select_admin" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (is_admin());

-- Order Items policies
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "order_items_select_admin" ON order_items FOR SELECT USING (is_admin());
CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Hero Slides policies (public read, admin write)
CREATE POLICY "hero_slides_select" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "hero_slides_insert_admin" ON hero_slides FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "hero_slides_update_admin" ON hero_slides FOR UPDATE USING (is_admin());
CREATE POLICY "hero_slides_delete_admin" ON hero_slides FOR DELETE USING (is_admin());

-- Sample hero slides
INSERT INTO hero_slides (title_ar, title_en, subtitle_ar, subtitle_en, image_url, link, sort_order) VALUES
  ('أحدث المنتجات', 'Latest Products', 'اكتشف تشكيلتنا الجديدة', 'Discover our new collection', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop', '/shop', 0),
  ('عروض حصرية', 'Exclusive Deals', 'خصومات تصل إلى 50%', 'Up to 50% off', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop', '/shop', 1),
  ('تسوق بسهولة', 'Shop with Ease', 'توصيل سريع لكل مكان', 'Fast delivery everywhere', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop', '/shop', 2);
