# 📝 Apply Better Auth Migration

## ✅ Option 1: Using Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/008_better_auth_schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

## ✅ Option 2: Using Supabase CLI (if installed)

```bash
supabase db push
```

## ✅ Option 3: Using Direct PostgreSQL Connection

```bash
psql "postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/008_better_auth_schema.sql
```

Replace `[YOUR-PROJECT-REF]` and `[YOUR-PASSWORD]` with your actual Supabase credentials.

---

## ⚠️ Important Notes

- This migration creates new tables: `auth_users`, `sessions`, `accounts`, `verification_tokens`
- Your existing `users` table is NOT modified
- A trigger is created to automatically link Better Auth users to your business users table
- Existing data in `users` table is safe and untouched

---

## 🔍 Verify Migration Success

After applying, run this query to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('auth_users', 'sessions', 'accounts', 'verification_tokens');
```

You should see all 4 tables listed.





