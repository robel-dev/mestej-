'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { content } from '@/lib/content';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const [locale, setLocale] = useState<'en' | 'sv'>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      const validLocale = (paramLocale === 'sv') ? 'sv' : 'en';
      setLocale(validLocale);
    });

    // Redirect if already logged in
    if (user && profile) {
      if (profile.status === 'approved') {
        router.push(`/${locale}/ordering`);
      }
    }
  }, [params, user, profile, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('🔐 Attempting login for:', email);

    try {
      console.log('📞 Calling signIn...');
      const result = await signIn(email, password);
      console.log('📦 SignIn result:', result);
      
      if (result.error) {
        console.error('❌ Login error:', result.error);
        setError(result.error.message || content[locale].auth.login.errors.invalidCredentials);
        setLoading(false);
      } else {
        console.log('✅ Login successful, redirecting...');
        // Give a tiny delay for state to update, then redirect
        setTimeout(() => {
          console.log('🚀 Navigating to:', `/${locale}/ordering`);
          router.push(`/${locale}/ordering`);
        }, 500);
      }
    } catch (err) {
      console.error('❌ Login exception:', err);
      setError(content[locale].auth.login.errors.generic);
      setLoading(false);
    }
  };

  const siteContent = content[locale];

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
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-serif font-bold golden-text mb-4">
            {siteContent.auth.login.title}
          </h1>
          <p className="text-white/80">
            {siteContent.auth.login.subtitle}
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
                {siteContent.auth.login.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder={siteContent.auth.login.email}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                {siteContent.auth.login.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder={siteContent.auth.login.password}
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
                {siteContent.auth.login.submit}...
              </span>
            ) : (
              siteContent.auth.login.submit
            )}
          </motion.button>

          <div className="pt-4 space-y-2 text-sm">
            <p className="text-white/70">
              {siteContent.auth.login.noAccount}{' '}
              <a
                href={`/${locale}/signup`}
                className="text-gold hover:text-warm-gold underline transition-colors"
              >
                {siteContent.auth.login.signUp}
              </a>
            </p>
            <p className="text-white/60 text-xs">
              {siteContent.auth.login.forgotPassword}
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
