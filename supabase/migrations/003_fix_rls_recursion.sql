-- Fix infinite recursion in RLS policies
-- The issue: policies were querying the same table they were protecting

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Only admins can approve users" ON users;

-- Create a helper function to check if user is admin
-- SECURITY DEFINER allows it to bypass RLS
-- STABLE means it won't modify the database and can be cached
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
SECURITY DEFINER
STABLE
SET search_path = public
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = user_id AND role = 'admin'
    );
$$;

-- Recreate admin policies using the helper function
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can approve users"
    ON users FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Fix other policies that had the same issue
DROP POLICY IF EXISTS "Admins can manage suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can manage product prices" ON product_prices;
DROP POLICY IF EXISTS "Admins can manage addresses" ON addresses;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;

-- Recreate them with the helper function
CREATE POLICY "Admins can manage suppliers"
    ON suppliers FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage product prices"
    ON product_prices FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage addresses"
    ON addresses FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage orders"
    ON orders FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage order items"
    ON order_items FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage payments"
    ON payments FOR ALL
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage notifications"
    ON notifications FOR ALL
    USING (is_admin(auth.uid()));

