-- Better Auth Schema Migration (Safe Version)
-- This version uses IF NOT EXISTS to avoid conflicts

-- ============================================
-- BETTER AUTH TABLES
-- ============================================

-- Auth Users Table (Better Auth managed)
CREATE TABLE IF NOT EXISTS auth_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions Table (Better Auth managed)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE
);

-- Accounts Table (Better Auth managed - for OAuth)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Verification Tokens (Better Auth managed)
CREATE TABLE IF NOT EXISTS verification_tokens (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider_id, account_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);

-- ============================================
-- TRIGGER: Auto-create business profile
-- ============================================

-- Function to create business profile when Better Auth user is created
CREATE OR REPLACE FUNCTION create_business_profile_from_auth()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into business users table with Better Auth user ID
    INSERT INTO users (id, email, role, status)
    VALUES (NEW.id::uuid, NEW.email, 'user', 'pending')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$;

-- Drop trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_better_auth_user_created ON auth_users;
CREATE TRIGGER on_better_auth_user_created
    AFTER INSERT ON auth_users
    FOR EACH ROW
    EXECUTE FUNCTION create_business_profile_from_auth();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own auth user" ON auth_users;
DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;

-- Create policies
CREATE POLICY "Users can view own auth user"
    ON auth_users FOR SELECT
    USING (id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can view own sessions"
    ON sessions FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true));

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that all tables were created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('auth_users', 'sessions', 'accounts', 'verification_tokens')
        GROUP BY table_schema
        HAVING COUNT(*) = 4
    ) THEN
        RAISE NOTICE '✅ All Better Auth tables created successfully!';
    ELSE
        RAISE NOTICE '⚠️ Some tables may be missing. Please verify.';
    END IF;
END $$;

