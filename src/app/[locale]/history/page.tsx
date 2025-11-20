'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/shared/constants/content';

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

  const siteContent = content[language];

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
            <span className="golden-text">{siteContent.history.title}</span>
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            {siteContent.history.subtitle}
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Ancient Origins */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-semibold golden-text mb-8">
              {siteContent.history.origins.title}
            </h2>
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed text-lg">
                {siteContent.history.origins.paragraph1}
              </p>
              <p className="text-white/80 leading-relaxed text-lg">
                {siteContent.history.origins.paragraph2}
              </p>
            </div>
          </motion.section>

          {/* European Accounts */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-semibold golden-text mb-8">
              {siteContent.history.european.title}
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {siteContent.history.european.description}
            </p>
          </motion.section>

          {/* Timeless Tradition */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-serif font-semibold golden-text mb-8">
              {siteContent.history.legacy.title}
            </h2>
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed text-lg">
                {siteContent.history.legacy.paragraph1}
              </p>
              <p className="text-white/80 leading-relaxed text-lg">
                {siteContent.history.legacy.paragraph2}
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
