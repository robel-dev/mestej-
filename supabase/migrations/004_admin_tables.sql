-- ============================================
-- ADMIN TABLES
-- ============================================
-- Migration: 004_admin_tables.sql
-- Description: Create admin-specific tables for activity logs and settings

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN ACTIVITY LOGS TABLE
-- ============================================
-- Tracks all admin actions for audit trail and compliance

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'approved_user', 'created_product', 'fulfilled_order'
    resource_type TEXT, -- e.g., 'user', 'product', 'order', 'settings'
    resource_id UUID, -- ID of the affected resource
    metadata JSONB, -- Additional details about the action
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_action CHECK (action != ''),
    CONSTRAINT valid_resource_type CHECK (resource_type IS NULL OR resource_type != '')
);

-- Indexes for efficient querying
CREATE INDEX idx_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX idx_activity_logs_resource ON admin_activity_logs(resource_type, resource_id);

-- ============================================
-- WEBSITE SETTINGS TABLE
-- ============================================
-- Stores configurable website settings (key-value pairs)

CREATE TABLE IF NOT EXISTS website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT, -- Human-readable description of the setting
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_key CHECK (key != '')
);

-- Index for fast key lookups
CREATE INDEX idx_settings_key ON website_settings(key);

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================

INSERT INTO website_settings (key, value, description) VALUES
    ('site_name', '"Mestej Winery"', 'Website name displayed in header and browser title'),
    ('site_description', '"Premium wines and liquors from Mestej Winery"', 'Site description for SEO'),
    ('default_currency', '"SEK"', 'Default currency for products'),
    ('enable_user_registration', 'true', 'Allow new users to register'),
    ('require_approval', 'true', 'Require admin approval for new users'),
    ('contact_email', '"info@mestej.com"', 'Contact email for customer inquiries'),
    ('enable_ordering', 'true', 'Enable the ordering system'),
    ('minimum_order_amount', '0', 'Minimum order amount (in default currency)'),
    ('max_cart_items', '50', 'Maximum number of items allowed in cart'),
    ('session_timeout_minutes', '30', 'Admin session timeout in minutes')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE admin_activity_logs IS 'Audit trail of all admin actions for compliance and security';
COMMENT ON TABLE website_settings IS 'Configurable website settings (key-value store)';

COMMENT ON COLUMN admin_activity_logs.action IS 'Type of action performed (e.g., approved_user, created_product)';
COMMENT ON COLUMN admin_activity_logs.resource_type IS 'Type of resource affected (e.g., user, product, order)';
COMMENT ON COLUMN admin_activity_logs.resource_id IS 'UUID of the affected resource';
COMMENT ON COLUMN admin_activity_logs.metadata IS 'Additional context about the action (JSON)';

COMMENT ON COLUMN website_settings.key IS 'Unique setting key (e.g., site_name, default_currency)';
COMMENT ON COLUMN website_settings.value IS 'Setting value stored as JSONB for flexibility';
COMMENT ON COLUMN website_settings.description IS 'Human-readable description of what this setting does';

