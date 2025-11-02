-- ============================================
-- ADMIN FUNCTIONS
-- ============================================
-- Migration: 005_admin_functions.sql
-- Description: Create admin-specific database functions

-- ============================================
-- FUNCTION: log_admin_activity
-- ============================================
-- Logs an admin action to the activity log
-- This should be called after every admin action for audit trail

CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id UUID,
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Insert activity log
    INSERT INTO admin_activity_logs (
        admin_id,
        action,
        resource_type,
        resource_id,
        metadata
    ) VALUES (
        p_admin_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_metadata
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$;

-- ============================================
-- FUNCTION: approve_user
-- ============================================
-- Approves a pending user and logs the action

CREATE OR REPLACE FUNCTION approve_user(
    p_user_id UUID,
    p_admin_id UUID
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_email TEXT;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Get user email for logging
    SELECT email INTO v_user_email
    FROM users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User % not found', p_user_id;
    END IF;
    
    -- Update user status
    UPDATE users
    SET 
        status = 'approved',
        approved_by = p_admin_id,
        approved_at = now(),
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log the activity
    PERFORM log_admin_activity(
        p_admin_id,
        'approved_user',
        'user',
        p_user_id,
        jsonb_build_object(
            'user_email', v_user_email,
            'previous_status', 'pending'
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- FUNCTION: reject_user
-- ============================================
-- Rejects a pending user and logs the action

CREATE OR REPLACE FUNCTION reject_user(
    p_user_id UUID,
    p_admin_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_email TEXT;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Get user email for logging
    SELECT email INTO v_user_email
    FROM users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User % not found', p_user_id;
    END IF;
    
    -- Update user status
    UPDATE users
    SET 
        status = 'rejected',
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log the activity
    PERFORM log_admin_activity(
        p_admin_id,
        'rejected_user',
        'user',
        p_user_id,
        jsonb_build_object(
            'user_email', v_user_email,
            'previous_status', 'pending',
            'reason', COALESCE(p_reason, 'No reason provided')
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- FUNCTION: block_user
-- ============================================
-- Blocks a user (approved or pending) and logs the action

CREATE OR REPLACE FUNCTION block_user(
    p_user_id UUID,
    p_admin_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_email TEXT;
    v_previous_status TEXT;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Get user email and current status for logging
    SELECT email, status INTO v_user_email, v_previous_status
    FROM users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User % not found', p_user_id;
    END IF;
    
    -- Update user status
    UPDATE users
    SET 
        status = 'blocked',
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log the activity
    PERFORM log_admin_activity(
        p_admin_id,
        'blocked_user',
        'user',
        p_user_id,
        jsonb_build_object(
            'user_email', v_user_email,
            'previous_status', v_previous_status,
            'reason', COALESCE(p_reason, 'No reason provided')
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- FUNCTION: get_dashboard_stats
-- ============================================
-- Returns key metrics for admin dashboard

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_stats JSONB;
    v_total_revenue NUMERIC;
    v_pending_orders INTEGER;
    v_pending_users INTEGER;
    v_total_products INTEGER;
    v_approved_users INTEGER;
    v_recent_orders INTEGER;
BEGIN
    -- Calculate total revenue (from paid orders)
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_total_revenue
    FROM orders
    WHERE status IN ('paid', 'fulfilled');
    
    -- Count pending orders
    SELECT COUNT(*)
    INTO v_pending_orders
    FROM orders
    WHERE status = 'placed';
    
    -- Count pending users
    SELECT COUNT(*)
    INTO v_pending_users
    FROM users
    WHERE status = 'pending';
    
    -- Count total products
    SELECT COUNT(*)
    INTO v_total_products
    FROM products;
    
    -- Count approved users
    SELECT COUNT(*)
    INTO v_approved_users
    FROM users
    WHERE status = 'approved';
    
    -- Count orders in last 7 days
    SELECT COUNT(*)
    INTO v_recent_orders
    FROM orders
    WHERE created_at >= now() - INTERVAL '7 days';
    
    -- Build result JSON
    v_stats := jsonb_build_object(
        'total_revenue', v_total_revenue,
        'pending_orders', v_pending_orders,
        'pending_users', v_pending_users,
        'total_products', v_total_products,
        'approved_users', v_approved_users,
        'recent_orders', v_recent_orders,
        'generated_at', now()
    );
    
    RETURN v_stats;
END;
$$;

-- ============================================
-- FUNCTION: get_recent_activity
-- ============================================
-- Returns recent admin activity logs (for dashboard)

CREATE OR REPLACE FUNCTION get_recent_activity(
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    admin_email TEXT,
    action TEXT,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        u.email AS admin_email,
        a.action,
        a.resource_type,
        a.resource_id,
        a.metadata,
        a.created_at
    FROM admin_activity_logs a
    JOIN users u ON a.admin_id = u.id
    ORDER BY a.created_at DESC
    LIMIT p_limit;
END;
$$;

-- ============================================
-- FUNCTION: fulfill_order
-- ============================================
-- Marks an order as fulfilled and logs the action

CREATE OR REPLACE FUNCTION fulfill_order(
    p_order_id UUID,
    p_admin_id UUID
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_number TEXT;
    v_user_id UUID;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Get order details for logging
    SELECT order_number, user_id INTO v_order_number, v_user_id
    FROM orders
    WHERE id = p_order_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order % not found', p_order_id;
    END IF;
    
    -- Update order status
    UPDATE orders
    SET 
        status = 'fulfilled',
        fulfilled_at = now()
    WHERE id = p_order_id;
    
    -- Log the activity
    PERFORM log_admin_activity(
        p_admin_id,
        'fulfilled_order',
        'order',
        p_order_id,
        jsonb_build_object(
            'order_number', v_order_number,
            'user_id', v_user_id
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- FUNCTION: cancel_order
-- ============================================
-- Cancels an order and logs the action

CREATE OR REPLACE FUNCTION cancel_order(
    p_order_id UUID,
    p_admin_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_number TEXT;
    v_user_id UUID;
    v_previous_status TEXT;
BEGIN
    -- Verify the admin_id is actually an admin
    IF NOT is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'User % is not an admin', p_admin_id;
    END IF;
    
    -- Get order details for logging
    SELECT order_number, user_id, status INTO v_order_number, v_user_id, v_previous_status
    FROM orders
    WHERE id = p_order_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order % not found', p_order_id;
    END IF;
    
    -- Update order status
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = p_order_id;
    
    -- Log the activity
    PERFORM log_admin_activity(
        p_admin_id,
        'cancelled_order',
        'order',
        p_order_id,
        jsonb_build_object(
            'order_number', v_order_number,
            'user_id', v_user_id,
            'previous_status', v_previous_status,
            'reason', COALESCE(p_reason, 'No reason provided')
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION log_admin_activity IS 'Logs an admin action to the activity log for audit trail';
COMMENT ON FUNCTION approve_user IS 'Approves a pending user and logs the action';
COMMENT ON FUNCTION reject_user IS 'Rejects a pending user and logs the action';
COMMENT ON FUNCTION block_user IS 'Blocks a user and logs the action';
COMMENT ON FUNCTION get_dashboard_stats IS 'Returns key metrics for admin dashboard';
COMMENT ON FUNCTION get_recent_activity IS 'Returns recent admin activity logs';
COMMENT ON FUNCTION fulfill_order IS 'Marks an order as fulfilled and logs the action';
COMMENT ON FUNCTION cancel_order IS 'Cancels an order and logs the action';

