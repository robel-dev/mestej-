'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { content } from '@/lib/content';

interface SignupPageProps {
  params: Promise<{ locale: string }>;
}

export default function SignupPage({ params }: SignupPageProps) {
  const [locale, setLocale] = useState<'en' | 'sv'>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      const validLocale = (paramLocale === 'sv') ? 'sv' : 'en';
      setLocale(validLocale);
    });

    // Redirect if already logged in
    if (user) {
      router.push(`/${locale}/login`);
    }
  }, [params, user, router, locale]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const siteContent = content[locale];

    // Validation
    if (!validateEmail(email)) {
      setError(siteContent.auth.signup.errors.invalidEmail);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(siteContent.auth.signup.errors.weakPassword);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(siteContent.auth.signup.errors.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setError(siteContent.auth.signup.errors.emailExists);
        } else {
          setError(error.message || siteContent.auth.signup.errors.generic);
        }
      } else {
        setSuccess(true);
        // Redirect to login after showing success message
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 3000);
      }
    } catch (err) {
      setError(siteContent.auth.signup.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const siteContent = content[locale];

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md w-full"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center"
            >
              <span className="text-3xl">✅</span>
            </motion.div>
            <h1 className="text-3xl font-serif font-bold golden-text mb-4">
              {siteContent.auth.signup.success}
            </h1>
            <p className="text-white/80 mb-6">
              {siteContent.auth.signup.pendingApproval}
            </p>
            <p className="text-white/60 text-sm">
              Redirecting to login...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-3xl font-serif font-bold golden-text mb-4">
            {siteContent.auth.signup.title}
          </h1>
          <p className="text-white/80">
            {siteContent.auth.signup.subtitle}
          </p>
        </div>
        
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl glass border border-gold/30 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                {siteContent.auth.signup.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder={siteContent.auth.signup.email}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                {siteContent.auth.signup.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder={siteContent.auth.signup.password}
                disabled={loading}
              />
              <p className="text-white/50 text-xs mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                {siteContent.auth.signup.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder={siteContent.auth.signup.confirmPassword}
                disabled={loading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                />
                {siteContent.auth.signup.submit}...
              </span>
            ) : (
              siteContent.auth.signup.submit
            )}
          </motion.button>

          <div className="pt-4 text-sm">
            <p className="text-white/70">
              {siteContent.auth.signup.hasAccount}{' '}
              <a
                href={`/${locale}/login`}
                className="text-gold hover:text-warm-gold underline transition-colors"
              >
                {siteContent.auth.signup.signIn}
              </a>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

