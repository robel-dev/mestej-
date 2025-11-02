'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/lib/content';

interface HeroSectionProps {
  language: 'en' | 'sv';
}

export default function HeroSection({ language }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState<Array<{ left: number; top: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const siteContent = content[language];

  useEffect(() => {
    setIsMounted(true);
    // Generate particle positions only on client
    const positions = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    setParticlePositions(positions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div
        style={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        className="absolute inset-0 parallax-element parallax-back"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-warm-gold/5" />
      </motion.div>

      {/* Floating Particles */}
      {isMounted && (
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/20 rounded-full"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + (i % 5) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 3) * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        {/* Logo/Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-gold via-warm-gold to-dark-gold flex items-center justify-center shadow-2xl shadow-gold/30"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🍯
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight"
        >
          <span className="golden-text">{siteContent.hero.title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8 leading-relaxed font-light"
        >
          {siteContent.hero.subtitle}
        </motion.p>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Honey Meads', 'Buckthorn Wines', 'Blueberry Reserves'].map((feature, index) => (
            <motion.div
              key={feature}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full glass border border-gold/30 text-sm font-medium"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-gold to-warm-gold text-black font-semibold text-lg rounded-full transition-all duration-300 overflow-hidden"
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-warm-gold to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10">{siteContent.hero.cta}</span>
          </motion.button>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 flex flex-col items-center"
          >
            <span className="text-sm text-white/60 mb-2">Scroll to explore</span>
            <motion.div
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-8 bg-gradient-to-b from-gold to-transparent"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Video Background Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute inset-0 z-0"
      >
        {/* Future: Replace with actual video */}
        <div className="w-full h-full bg-gradient-to-br from-black/50 via-gold/5 to-black/50" />
      </motion.div>

      {/* Systembolaget Link */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8 left-8 hidden lg:block"
      >
        <a
          href="https://systembolaget.se"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 glass border border-gold/30 rounded-lg text-sm text-white hover:text-gold transition-colors duration-300"
        >
          <span>Available at Systembolaget</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
