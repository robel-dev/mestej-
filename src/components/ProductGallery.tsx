'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { products } from '@/lib/content';
import { content } from '@/lib/content';

interface ProductGalleryProps {
  language: 'en' | 'sv';
}

export default function ProductGallery({ language }: ProductGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const siteContent = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const productTypes = {
    honey: { color: 'from-amber-400 to-yellow-600', icon: '🍯', label: 'Honey Mead' },
    buckthorn: { color: 'from-orange-400 to-red-600', icon: '🌿', label: 'Buckthorn Wine' },
    blueberry: { color: 'from-blue-400 to-purple-600', icon: '🫐', label: 'Blueberry Reserve' },
  };

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            <span className="golden-text">{siteContent.wines.title}</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {siteContent.wines.subtitle}
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const productStyle = productTypes[product.type];
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="wine-card group relative overflow-hidden rounded-2xl glass border border-gold/30 p-6 cursor-pointer"
                onClick={() => setSelectedProduct(selectedProduct === index ? null : index)}
              >
                {/* Product Image */}
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-black/50 to-black/80 flex items-center justify-center">
                  {/* Placeholder for actual product image */}
                  <motion.div
                    className={`w-24 h-32 rounded-lg bg-gradient-to-b ${productStyle.color} flex items-center justify-center text-4xl shadow-2xl`}
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {productStyle.icon}
                  </motion.div>
                  
                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4"
                  >
                    <span className="text-white text-sm font-medium">Click to learn more</span>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-white mb-2">
                      {product.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${productStyle.color} text-white`}>
                      {productStyle.label}
                    </span>
                  </div>

                  {/* Expandable Details */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: selectedProduct === index ? 'auto' : 0,
                      opacity: selectedProduct === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gold/20 space-y-3">
                      {/* Available Restaurants */}
                      <div>
                        <h4 className="text-sm font-semibold text-gold mb-2">Available at:</h4>
                        <div className="space-y-1">
                          {product.available_at.map((restaurant, idx) => (
                            <span key={idx} className="block text-sm text-white/70">
                              • {restaurant}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Systembolaget Link */}
                      <motion.a
                        href={product.systembolaget_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                      >
                        <span>Buy at Systembolaget</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.a>
                    </div>
                  </motion.div>
                </div>

                {/* Card border glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ boxShadow: "0 0 0 0 rgba(255, 215, 0, 0)" }}
                  whileHover={{ boxShadow: "0 0 30px 0 rgba(255, 215, 0, 0.3)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Restaurant Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-serif font-semibold golden-text mb-4">
            Find Us at Fine Dining Establishments
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our premium wines are carefully selected by top restaurants who appreciate 
            the artistry and quality of traditional Swedish mead-making.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg glass border border-gold/30 text-gold font-medium transition-all duration-300 hover:bg-gold/10"
          >
            View All Locations
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
