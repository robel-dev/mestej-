'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/presentation/components/common/Navigation';
import AgeGate from '@/presentation/components/common/AgeGate';
import { CartProvider } from '@/presentation/contexts/CartContext';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    // Extract locale from params
    params.then(({ locale: paramLocale }) => {
      const validLocale = (paramLocale === 'sv') ? 'sv' : 'en';
      setLocale(validLocale);
      localStorage.setItem('language', validLocale);
    });

    try {
      // Check if user has already been age verified
      const ageVerified = localStorage.getItem('age-verified');

      if (ageVerified === 'true') {
        setIsAgeVerified(true);
        setShowAgeGate(false);
      }
    } catch (error) {
      console.log('localStorage not available during SSR');
    }

    setIsLoading(false);
  }, [params]);

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    setShowAgeGate(false);
    localStorage.setItem('age-verified', 'true');
  };

  const handleAgeDeny = () => {
    // Redirect to external site or show message
    window.location.href = 'https://www.google.com';
  };

  const handleLanguageChange = (lang: 'en' | 'sv') => {
    setLocale(lang);
    localStorage.setItem('language', lang);
    // Navigate to the new locale
    const currentPath = window.location.pathname.replace(/^\/(en|sv)/, '');
    window.location.href = `/${lang}${currentPath}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center"
        >
          <span className="text-2xl">🍯</span>
        </motion.div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/background-mestej.png')`,
            backgroundSize: 'contain',
            filter: 'brightness(0.5)',
          }}
        />

        {/* Navigation */}
        {isAgeVerified && (
          <Navigation
            language={locale}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {/* Main Content */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {isAgeVerified ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                key="main-content"
              >
                {children}
              </motion.div>
            ) : (
              <div key="age-gate-placeholder" />
            )}
          </AnimatePresence>
        </main>

        {/* Age Gate */}
        <AgeGate
          isOpen={showAgeGate}
          onConfirm={handleAgeConfirm}
          onDeny={handleAgeDeny}
          language={locale}
        />

        {/* Footer */}
        <AnimatePresence>
          {isAgeVerified && (
            <motion.footer
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative z-10 mt-20 pb-8"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-white/60 text-sm">
                  <p>&copy; 2024 Mestej Winery. All rights reserved.</p>
                </div>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </CartProvider>
  );
}

