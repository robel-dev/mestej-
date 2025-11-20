'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/shared/constants/content';

interface WebshopPageProps {
  params: Promise<{ locale: string }>;
}

export default function WebshopPage({ params }: WebshopPageProps) {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    params.then(({ locale }) => {
      const validLocale = (locale === 'sv') ? 'sv' : 'en';
      setLanguage(validLocale);
    });
  }, [params]);

  const siteContent = content[language];

  const products = [
    { name: siteContent.webshop.products.tshirt, price: 25, icon: '👕' },
    { name: siteContent.webshop.products.wineGlass, price: 15, icon: '🍷' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
            <span className="golden-text">{siteContent.webshop.title}</span>
          </h1>
          <p className="text-xl text-white/80">
            {siteContent.webshop.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl glass border border-gold/30"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="text-xl font-serif font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold golden-text mb-4">
                  ${product.price}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold"
                >
                  {siteContent.webshop.comingSoon}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
