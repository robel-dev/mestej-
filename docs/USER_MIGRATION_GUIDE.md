# 👥 User Migration Guide: Supabase Auth → Better Auth

## 📋 Overview

This guide helps you migrate existing users from Supabase Auth to Better Auth while preserving all user data and relationships.

## 🎯 Migration Strategy

### **Option A: Fresh Start (No Existing Users)**
If you have no users yet or it's okay to start fresh:
1. ✅ Just apply the Better Auth migration
2. ✅ Users will sign up fresh with Better Auth
3. ✅ No data migration needed!

### **Option B: Migrate Existing Users** 
If you have existing users that need to be migrated:
1. Apply Better Auth schema migration
2. Run the user migration script
3. Inform users they need to reset passwords
4. Test thoroughly before going live

---

## 🚀 Step-by-Step Migration Process

### **Step 1: Backup Your Database** ⚠️
```bash
# From Supabase dashboard: 
# Settings > Database > Create backup
```

### **Step 2: Apply Better Auth Schema**
Run the migration file in Supabase SQL Editor:
```sql
-- File: supabase/migrations/008_better_auth_schema.sql
-- Copy and paste into SQL Editor, then click "Run"
```

### **Step 3: Check Existing Users**
See how many users you have:
```sql
SELECT COUNT(*) FROM auth.users;
SELECT email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;
```

### **Step 4: Run Migration Script**
If you have existing users, run:
```sql
-- File: scripts/migrate-users.sql
-- Copy and paste into SQL Editor, then click "Run"
```

This will:
- ✅ Copy users from `auth.users` to `auth_users`
- ✅ Preserve user IDs (all foreign keys remain valid)
- ✅ Migrate email verification status
- ✅ Create password reset requirement

### **Step 5: Verify Migration**
Check that users were migrated:
```sql
SELECT 
    (SELECT COUNT(*) FROM auth.users) as supabase_users,
    (SELECT COUNT(*) FROM auth_users) as better_auth_users,
    (SELECT COUNT(*) FROM users) as business_profiles;
```

All three numbers should match!

### **Step 6: Test With Your Account**
1. Deploy the updated code with Better Auth
2. Go to login page
3. Try logging in with your existing credentials
4. You should see an error (expected - password needs reset)
5. Use "Forgot Password" to reset your password
6. Login with new password
7. Verify your profile loads correctly

### **Step 7: Inform Users**
Send an email to all users:

```
Subject: Action Required: Password Reset

Hi [Name],

We've upgraded our authentication system for better security and performance!

Please reset your password to continue accessing your account:
1. Go to [your-site]/login
2. Click "Forgot Password"
3. Follow the email instructions

All your data, orders, and settings are safe and unchanged.

Thanks!
The [Your Company] Team
```

---

## 🔄 Alternative: No Migration (Fresh Start)

If you prefer a fresh start or have few users:

### **Option: Recreate Accounts**
1. Apply Better Auth schema
2. Don't run migration script
3. Manually recreate important accounts (admins, etc.)
4. Inform users to sign up again

**Pros:**
- ✅ Cleaner database
- ✅ No password reset hassle
- ✅ Fresh start

**Cons:**
- ❌ Users lose access
- ❌ Need to manually link data

---

## ❓ FAQ

### **Q: Will I lose user data?**
**A:** No! Your `users` table (business profiles, roles, status, permits) remains unchanged. Only the authentication method changes.

### **Q: What happens to foreign keys?**
**A:** User IDs are preserved, so all relationships (orders, addresses, payments) remain intact.

### **Q: Can users keep their passwords?**
**A:** No, passwords cannot be migrated (they're encrypted differently). Users must reset passwords.

### **Q: What if migration fails?**
**A:** You can rollback:
```sql
DELETE FROM accounts WHERE provider_id = 'credential';
DELETE FROM auth_users;
-- Then revert code to use Supabase Auth
```

### **Q: Can I test before going live?**
**A:** Yes! Apply migrations to a staging/dev environment first, test thoroughly, then apply to production.

### **Q: How long does migration take?**
**A:** The SQL script runs in seconds, even for thousands of users. Most time is spent testing and communicating with users.

---

## ✅ Post-Migration Checklist

- [ ] Better Auth schema applied
- [ ] Users migrated (if applicable)
- [ ] Verified user counts match
- [ ] Tested login with migrated account
- [ ] Tested signup with new account
- [ ] Tested password reset flow
- [ ] Verified profile loading works
- [ ] Tested protected routes
- [ ] Sent communication to users
- [ ] Old Supabase Auth code removed
- [ ] Monitoring logs for errors

---

## 🆘 Troubleshooting

### **Users can't log in**
- Check they've reset their password
- Verify `auth_users` table has their email
- Check Better Auth API is running (`/api/auth/session`)

### **Profile not loading**
- Verify `users` table has matching ID
- Check Supabase connection string is correct
- Look for errors in browser console

### **Migration script errors**
- Ensure Better Auth schema was applied first
- Check for ID conflicts (run `SELECT id FROM auth_users`)
- Verify PostgreSQL version compatibility

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check server logs
3. Verify all migrations applied successfully
4. Test with a single account first
5. Rollback if necessary and try again

Good luck with your migration! 🚀





