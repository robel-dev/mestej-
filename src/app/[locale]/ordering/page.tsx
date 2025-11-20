'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { content } from '@/shared/constants/content';

interface OrderingPageProps {
  params: Promise<{ locale: string }>;
}

export default function OrderingPage({ params }: OrderingPageProps) {
  const [locale, setLocale] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      const validLocale = (paramLocale === 'sv') ? 'sv' : 'en';
      setLocale(validLocale);
    });
  }, [params]);

  const siteContent = content[locale];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold golden-text mb-4">
            {siteContent.ordering.title}
          </h1>
          <p className="text-xl text-white/80">
            {siteContent.ordering.subtitle}
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <div className="text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-warm-gold/20 border border-gold/30 flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-5xl">🚀</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-serif font-bold text-white mb-6"
          >
            {siteContent.ordering.comingSoon.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg mb-8 max-w-2xl mx-auto"
          >
            {siteContent.ordering.comingSoon.message}
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={`/${locale}/contact`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg glass border border-gold/30 text-white font-semibold hover:text-gold transition-all duration-300 hover:border-gold/50"
            >
              {siteContent.ordering.comingSoon.contactButton}
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}
