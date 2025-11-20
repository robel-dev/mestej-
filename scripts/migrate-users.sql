-- Migration Script: Supabase Auth Users → Better Auth
-- 
-- This script migrates existing users from auth.users (Supabase Auth)
-- to auth_users (Better Auth) while preserving their business profiles.
--
-- ⚠️ IMPORTANT: Run this AFTER applying the Better Auth migration (008_better_auth_schema.sql)
--
-- What this does:
-- 1. Copies users from auth.users to auth_users
-- 2. Creates password placeholders (users must reset passwords)
-- 3. Links to existing business profiles in the users table
-- 4. Preserves user IDs so all foreign keys remain valid

-- ============================================
-- STEP 1: Check existing users
-- ============================================

-- See how many users you have in Supabase Auth
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL as email_verified
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- STEP 2: Migrate users to Better Auth
-- ============================================

-- Insert existing auth users into Better Auth users table
INSERT INTO auth_users (id, email, email_verified, name, created_at, updated_at)
SELECT 
    id::text,  -- Convert UUID to text for Better Auth
    email,
    email_confirmed_at IS NOT NULL,  -- Set email_verified based on confirmation
    COALESCE(raw_user_meta_data->>'name', email),  -- Try to get name from metadata, fallback to email
    created_at,
    updated_at
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET 
    email = EXCLUDED.email,
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();

-- ============================================
-- STEP 3: Create password recovery accounts
-- ============================================

-- For each migrated user, create an account entry
-- Users will need to reset their password on first login with Better Auth
INSERT INTO accounts (
    id,
    account_id,
    provider_id,
    user_id,
    password,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid()::text as id,
    id::text as account_id,
    'credential' as provider_id,  -- Better Auth uses 'credential' for email/password
    id::text as user_id,
    'MIGRATION_REQUIRED' as password,  -- Placeholder - users must reset password
    created_at,
    updated_at
FROM auth.users
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 4: Verify migration
-- ============================================

-- Check that all users were migrated
SELECT 
    (SELECT COUNT(*) FROM auth.users) as supabase_auth_users,
    (SELECT COUNT(*) FROM auth_users) as better_auth_users,
    (SELECT COUNT(*) FROM users) as business_profiles,
    (SELECT COUNT(*) FROM accounts) as better_auth_accounts;

-- ============================================
-- STEP 5: Create password reset requirement
-- ============================================

-- Update users table to mark that password reset is required
-- (Optional: Add a column to track this)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT FALSE;
-- UPDATE users SET password_reset_required = TRUE WHERE id IN (SELECT id::uuid FROM auth_users);

-- ============================================
-- STEP 6: (Optional) Disable Supabase Auth
-- ============================================

-- After verifying everything works, you can optionally disable Supabase Auth
-- This prevents accidental logins through old auth system
-- 
-- ⚠️ CAUTION: Only do this after thoroughly testing Better Auth!
--
-- UPDATE auth.users SET email_confirmed_at = NULL;  -- Unverify all emails
-- UPDATE auth.users SET banned_until = 'infinity';  -- Ban all users

-- ============================================
-- NOTES
-- ============================================
--
-- 1. All users will need to use "Forgot Password" to reset their password
--    since we cannot migrate encrypted passwords from Supabase Auth
--
-- 2. User IDs are preserved, so all foreign keys in orders, addresses, etc. remain valid
--
-- 3. Email verification status is migrated
--
-- 4. User metadata (name) is migrated if available
--
-- 5. After migration, test with a few accounts before announcing to all users
--
-- 6. Send an email to all users informing them about password reset requirement

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- If something goes wrong, you can rollback:
-- DELETE FROM accounts WHERE provider_id = 'credential';
-- DELETE FROM auth_users;
-- Re-enable Supabase Auth in your app






