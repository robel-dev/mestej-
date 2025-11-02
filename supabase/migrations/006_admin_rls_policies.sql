-- ============================================
-- ADMIN RLS POLICIES
-- ============================================
-- Migration: 006_admin_rls_policies.sql
-- Description: Set up RLS policies for admin access
-- Note: Uses existing is_admin() function to avoid infinite recursion

-- ============================================
-- ENABLE RLS ON NEW TABLES
-- ============================================

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ADMIN ACTIVITY LOGS POLICIES
-- ============================================

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
    ON admin_activity_logs FOR SELECT
    USING (is_admin(auth.uid()));

-- Admins can insert activity logs (via functions)
CREATE POLICY "Admins can insert activity logs"
    ON admin_activity_logs FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- No one can update or delete activity logs (audit trail integrity)
-- Activity logs are append-only for compliance

-- ============================================
-- WEBSITE SETTINGS POLICIES
-- ============================================

-- Admins can view all settings
CREATE POLICY "Admins can view all settings"
    ON website_settings FOR SELECT
    USING (is_admin(auth.uid()));

-- Admins can insert new settings
CREATE POLICY "Admins can insert settings"
    ON website_settings FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- Admins can update settings
CREATE POLICY "Admins can update settings"
    ON website_settings FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Admins can delete settings (with caution)
CREATE POLICY "Admins can delete settings"
    ON website_settings FOR DELETE
    USING (is_admin(auth.uid()));

-- Regular users can read certain settings (public settings only)
-- This allows the frontend to fetch site name, currency, etc.
CREATE POLICY "Users can view public settings"
    ON website_settings FOR SELECT
    USING (
        key IN (
            'site_name',
            'site_description',
            'default_currency',
            'enable_user_registration',
            'enable_ordering',
            'contact_email'
        )
    );

-- ============================================
-- ENHANCED ADMIN POLICIES FOR EXISTING TABLES
-- ============================================
-- These policies allow admins to perform actions that regular users cannot

-- USERS TABLE: Admins can view user permit documents
CREATE POLICY "Admins can view user permit documents"
    ON users FOR SELECT
    USING (is_admin(auth.uid()) AND permit_document_url IS NOT NULL);

-- PRODUCTS TABLE: Admins can manage products
-- (Existing policies already cover this, but let's add explicit INSERT/DELETE)
CREATE POLICY "Admins can insert products"
    ON products FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
    ON products FOR DELETE
    USING (is_admin(auth.uid()));

-- PRODUCT_PRICES TABLE: Admins can manage pricing
CREATE POLICY "Admins can insert product prices"
    ON product_prices FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update product prices"
    ON product_prices FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete product prices"
    ON product_prices FOR DELETE
    USING (is_admin(auth.uid()));

-- ORDERS TABLE: Admins can view all orders (already covered)
-- Additional: Admins can update order status
CREATE POLICY "Admins can update order status"
    ON orders FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- SUPPLIERS TABLE: Admins can manage suppliers (already covered)

-- ============================================
-- GRANTS (Ensure functions can be called by admins)
-- ============================================

-- Grant execute permissions on admin functions
GRANT EXECUTE ON FUNCTION log_admin_activity TO authenticated;
GRANT EXECUTE ON FUNCTION approve_user TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user TO authenticated;
GRANT EXECUTE ON FUNCTION block_user TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activity TO authenticated;
GRANT EXECUTE ON FUNCTION fulfill_order TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_order TO authenticated;

-- Note: Functions have SECURITY DEFINER and verify is_admin() internally,
-- so only actual admins can execute them successfully

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON POLICY "Admins can view all activity logs" ON admin_activity_logs IS 
    'Allows admins to view all activity logs for audit purposes';

COMMENT ON POLICY "Admins can insert activity logs" ON admin_activity_logs IS 
    'Allows admins to create activity log entries (via functions)';

COMMENT ON POLICY "Admins can view all settings" ON website_settings IS 
    'Allows admins to view all website settings';

COMMENT ON POLICY "Users can view public settings" ON website_settings IS 
    'Allows regular users to view public settings like site name and currency';

-- ============================================
-- VERIFICATION QUERIES (for testing)
-- ============================================
-- Run these queries to verify RLS policies work correctly:

-- Test 1: Verify is_admin() function exists and works
-- SELECT is_admin(auth.uid());

-- Test 2: Verify admin can view activity logs
-- SELECT * FROM admin_activity_logs LIMIT 5;

-- Test 3: Verify admin can view all users
-- SELECT * FROM users LIMIT 5;

-- Test 4: Verify admin can view settings
-- SELECT * FROM website_settings;

-- Test 5: Verify regular user can view public settings
-- SELECT * FROM website_settings WHERE key IN ('site_name', 'default_currency');

