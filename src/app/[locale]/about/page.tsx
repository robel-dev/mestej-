'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/shared/constants/content';
import Link from 'next/link';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default function AboutPage({ params }: AboutPageProps) {
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
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
            <span className="golden-text">{siteContent.about.title}</span>
          </h1>
        </motion.div>

        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="glass rounded-3xl p-8 sm:p-12 border border-gold/20">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold golden-text mb-6">
              {siteContent.about.welcome.title}
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              {siteContent.about.welcome.description}
            </p>
          </div>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold golden-text mb-8">
            {siteContent.about.aboutUs.title}
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-white/80 leading-relaxed">
              {siteContent.about.aboutUs.paragraph1}
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              {siteContent.about.aboutUs.paragraph2}
            </p>
          </div>
        </motion.section>

        {/* Call to Action - View Products */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link href={`/${language}/products`}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-gold to-warm-gold text-black font-semibold text-lg rounded-full transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-warm-gold to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center">
                {siteContent.about.viewProducts}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
