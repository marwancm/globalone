-- Fix security warnings

-- 1. Fix users_insert policy to be more restrictive
-- Instead of allowing all inserts, only allow users to insert their own record
DROP POLICY IF EXISTS users_insert ON public.users;
CREATE POLICY users_insert ON public.users
  FOR INSERT
  WITH CHECK (id = (select auth.uid()));

-- 2. Combine multiple permissive policies into single policies for better performance

-- Users SELECT - combine admin and own policies
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_policy ON public.users
  FOR SELECT
  USING (
    id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid()) 
      AND users.role = 'admin'
    )
  );

-- Users UPDATE - combine admin and own policies
DROP POLICY IF EXISTS users_update_admin ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_policy ON public.users
  FOR UPDATE
  USING (
    id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid()) 
      AND users.role = 'admin'
    )
  );

-- Orders SELECT - combine admin and own policies
DROP POLICY IF EXISTS orders_select_admin ON public.orders;
DROP POLICY IF EXISTS orders_select_own ON public.orders;
CREATE POLICY orders_select_policy ON public.orders
  FOR SELECT
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid()) 
      AND users.role = 'admin'
    )
  );

-- Order items SELECT - combine admin and own policies
DROP POLICY IF EXISTS order_items_select_admin ON public.order_items;
DROP POLICY IF EXISTS order_items_select_own ON public.order_items;
CREATE POLICY order_items_select_policy ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        orders.user_id = (select auth.uid()) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = (select auth.uid()) 
          AND users.role = 'admin'
        )
      )
    )
  );

COMMENT ON FILE IS 'Fixes security warnings by making policies more restrictive and combining multiple permissive policies';
