'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/lib/content';

export default function AboutPage() {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'sv' || 'en';
    setLanguage(savedLanguage);
  }, []);

  const siteContent = content[language];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            <span className="golden-text">{siteContent.about.title}</span>
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            {siteContent.about.content}
          </p>
        </motion.div>

        {/* Story Sections */}
        <div className="space-y-20">
          {/* Our Mission */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-serif font-semibold golden-text mb-6">
                Our Mission
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                At Mestej, we believe in honoring the ancient art of mead-making while embracing 
                modern techniques to create wines that speak to both tradition and innovation. 
                Our mission is to craft exceptional beverages that capture the essence of Swedish 
                terroir and the bounty of our local ingredients.
              </p>
              <p className="text-white/80 leading-relaxed">
                Every bottle tells a story of careful selection, patient fermentation, and 
                passionate craftsmanship. We work closely with local farmers and foragers 
                to source the finest honey, buckthorn, and blueberries that form the 
                foundation of our unique wine collection.
              </p>
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-80 rounded-2xl glass border border-gold/30 bg-gradient-to-br from-gold/20 to-warm-gold/10 flex items-center justify-center"
              >
                <span className="text-6xl">🍯</span>
              </motion.div>
            </div>
          </motion.section>

          {/* Our Process */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="lg:order-2">
              <h2 className="text-3xl font-serif font-semibold golden-text mb-6">
                Traditional Methods, Modern Excellence
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Our winemaking process combines time-honored techniques passed down through 
                generations with modern equipment and scientific understanding. We believe 
                this balance creates wines that honor our heritage while meeting contemporary 
                standards of excellence.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/70">Hand-selected ingredients from local sources</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/70">Temperature-controlled fermentation process</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/70">Extended aging for optimal flavor development</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/70">Small-batch production ensuring quality control</p>
                </div>
              </div>
            </div>
            <div className="lg:order-1 relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-80 rounded-2xl glass border border-gold/30 bg-gradient-to-br from-blue-500/20 to-purple-500/10 flex items-center justify-center"
              >
                <span className="text-6xl">🌿</span>
              </motion.div>
            </div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif font-semibold golden-text mb-12">
              What Drives Us
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Sustainability',
                  description: 'We are committed to sustainable practices that protect our environment for future generations.',
                  icon: '🌱'
                },
                {
                  title: 'Quality',
                  description: 'Every bottle meets our exacting standards for flavor, aroma, and overall excellence.',
                  icon: '⭐'
                },
                {
                  title: 'Community',
                  description: 'We support local farmers, artisans, and businesses that share our values and vision.',
                  icon: '🤝'
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass border border-gold/30"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-serif font-semibold text-gold mb-3">
                    {value.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
