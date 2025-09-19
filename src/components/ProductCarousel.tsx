'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { products } from '@/lib/content';

interface ProductCarouselProps {
  language: 'en' | 'sv';
}

export default function ProductCarousel({ language }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const productTypes = {
    honey: { 
      color: 'from-amber-400 to-yellow-600', 
      icon: '🍯', 
      label: 'Honey Mead',
      templateImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&crop=center'
    },
    buckthorn: { 
      color: 'from-orange-400 to-red-600', 
      icon: '🌿', 
      label: 'Buckthorn Wine',
      templateImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=600&fit=crop&crop=center'
    },
    blueberry: { 
      color: 'from-blue-400 to-purple-600', 
      icon: '🫐', 
      label: 'Blueberry Reserve',
      templateImage: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=600&fit=crop&crop=center'
    },
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            <span className="golden-text">Our Wine Collection</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover our handcrafted premium wines, each telling a story of tradition and excellence
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Carousel */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden glass border border-gold/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full w-full p-8">
                  {/* Product Image */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, rotateY: -15 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative"
                    >
                      {/* Wine Bottle Silhouette */}
                      <div className="relative w-48 h-96 rounded-3xl overflow-hidden shadow-2xl">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${productTypes[products[currentIndex].type as keyof typeof productTypes].templateImage})`,
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${productTypes[products[currentIndex].type as keyof typeof productTypes].color} opacity-80`} />
                        
                        {/* Product Label */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">
                              {productTypes[products[currentIndex].type as keyof typeof productTypes].icon}
                            </div>
                            <div className="font-serif font-bold text-xl">
                              MESTEJ
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Elements */}
                      <motion.div
                        animate={{ 
                          y: [-10, 10, -10],
                          rotate: [0, 5, 0] 
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gold/20 backdrop-blur-lg flex items-center justify-center"
                      >
                        <span className="text-2xl">✨</span>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Product Information */}
                  <div className="flex flex-col justify-center space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${productTypes[products[currentIndex].type as keyof typeof productTypes].color} text-white mb-4`}>
                        {productTypes[products[currentIndex].type as keyof typeof productTypes].label}
                      </span>
                      
                      <h3 className="text-4xl font-serif font-bold golden-text mb-4">
                        {products[currentIndex].name}
                      </h3>
                      
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        Crafted with the finest {products[currentIndex].type} sourced from local Swedish farms. 
                        Each bottle represents our commitment to traditional mead-making excellence.
                      </p>
                    </motion.div>

                    {/* Available Locations */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="space-y-3"
                    >
                      <h4 className="text-lg font-semibold text-gold">Available at:</h4>
                      <div className="space-y-2">
                        {products[currentIndex].available_at.map((restaurant, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gold rounded-full" />
                            <span className="text-white/70">{restaurant}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <motion.a
                        href={products[currentIndex].systembolaget_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-warm-gold text-black font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
                      >
                        <span>Buy at Systembolaget</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Auto-play indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 text-white/60 text-sm">
              <motion.div
                animate={{ rotate: isAutoPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: isAutoPlaying ? Infinity : 0, ease: "linear" }}
                className="w-4 h-4"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-4">
            {products.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gold shadow-lg shadow-gold/50' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-full bg-gradient-to-r from-gold to-warm-gold"
              style={{ display: isAutoPlaying ? 'block' : 'none' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
