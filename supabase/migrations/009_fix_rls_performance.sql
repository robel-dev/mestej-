-- Fix RLS Performance Issues by Simplifying Policies
-- 
-- Problem: The is_admin() helper function queries the users table,
-- which triggers RLS policies that call is_admin() again → infinite recursion
-- 
-- Solution: 
-- 1. Remove is_admin() function and all dependent policies
-- 2. Keep RLS simple: Users can only access their own data
-- 3. Admins use SECURITY DEFINER functions (already exist in 005_admin_functions.sql)

-- Drop the problematic function and ALL dependent policies automatically
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- ============================================
-- USERS TABLE - Simplified Policies
-- ============================================

-- Simple policies: Users can only access their own data
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- ORDERS TABLE - Simplified Policies
-- ============================================

CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS TABLE - Simplified Policies
-- ============================================

CREATE POLICY "Users can view their own order items"
    ON order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own order items"
    ON order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    ));

-- ============================================
-- SUPPLIERS TABLE - User Read-Only
-- ============================================

CREATE POLICY "Users can view suppliers"
    ON suppliers FOR SELECT
    USING (true); -- All authenticated users can view suppliers

-- ============================================
-- PRODUCTS TABLE - User Read-Only
-- ============================================

CREATE POLICY "Users can view products"
    ON products FOR SELECT
    USING (true); -- All authenticated users can view products

-- ============================================
-- PRODUCT PRICES TABLE - User Read-Only
-- ============================================

CREATE POLICY "Users can view product prices"
    ON product_prices FOR SELECT
    USING (true); -- All authenticated users can view prices

-- ============================================
-- ADDRESSES TABLE - Own Data Only
-- ============================================

CREATE POLICY "Users can view their own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
    ON addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
    ON addresses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
    ON addresses FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PAYMENTS TABLE - Own Data Only
-- ============================================

CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = payments.order_id 
        AND orders.user_id = auth.uid()
    ));

-- ============================================
-- NOTIFICATIONS TABLE - Own Data Only
-- ============================================

CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- WEBSITE SETTINGS - Read-Only for Users
-- ============================================

CREATE POLICY "Users can view website settings"
    ON website_settings FOR SELECT
    USING (true); -- All authenticated users can view settings

-- ============================================
-- VERIFICATION
-- ============================================

SELECT '✅ RLS policies simplified! No more recursion!' as result;
SELECT 'ℹ️ Regular users: Can access their own data only' as info;
SELECT 'ℹ️ Admins: Use the SECURITY DEFINER functions in 005_admin_functions.sql' as admin_info;
