'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HistoryPageProps {
  params: Promise<{ locale: string }>;
}

export default function HistoryPage({ params }: HistoryPageProps) {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    params.then(({ locale }) => {
      const validLocale = (locale === 'sv') ? 'sv' : 'en';
      setLanguage(validLocale);
    });
  }, [params]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            <span className="golden-text">Our History</span>
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Rooted in heritage, Mestej carries forward centuries of mead-making tradition.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif font-semibold golden-text mb-8">
              A Legacy of Craftsmanship
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              The art of mead-making has been part of Scandinavian culture for over a thousand years. 
              At Mestej, we honor this ancient tradition while bringing modern innovation to create 
              wines that capture the essence of our Nordic heritage.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
