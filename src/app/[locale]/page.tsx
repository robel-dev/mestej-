'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ProductCarousel from '@/components/ProductCarousel';
import SocialMediaPreview from '@/components/SocialMediaPreview';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    params.then(({ locale }) => {
      const validLocale = (locale === 'sv') ? 'sv' : 'en';
      setLanguage(validLocale);
    });
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Hero Section */}
      <HeroSection language={language} />
      
      {/* Product Carousel */}
      <ProductCarousel language={language} />
      
      {/* Promo Video Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold golden-text mb-8">
            Discover Our Craft
          </h2>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-gold/30">
            {/* Video placeholder - replace with actual video */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-black/50 to-warm-gold/20 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer shadow-2xl"
              >
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-4 text-white/80 text-sm"
            >
              Coming soon: Behind the scenes at Mestej Winery
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Social Media Preview */}
      <SocialMediaPreview language={language} />
    </motion.div>
  );
}
