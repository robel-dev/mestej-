'use client';

import { Inter, Playfair_Display } from 'next/font/google';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AgeGate from '@/components/AgeGate';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already been age verified
    const ageVerified = localStorage.getItem('age-verified');
    const savedLanguage = localStorage.getItem('language') as 'en' | 'sv' || 'en';
    
    if (ageVerified === 'true') {
      setIsAgeVerified(true);
      setShowAgeGate(false);
    }
    
    setLanguage(savedLanguage);
    setIsLoading(false);
  }, []);

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    setShowAgeGate(false);
    localStorage.setItem('age-verified', 'true');
  };

  const handleAgeDeny = () => {
    // Redirect to external site or show message
    window.location.href = 'https://www.google.com';
  };

  const handleLanguageChange = (lang: 'en' | 'sv') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (isLoading) {
    return (
      <html lang={language} className={`${inter.variable} ${playfair.variable}`}>
        <body className="bg-black">
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center"
            >
              <span className="text-2xl">🍯</span>
            </motion.div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={language} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <title>Mestej Winery - Premium Honey, Buckthorn & Blueberry Wines</title>
        <meta name="description" content="Crafting exceptional honey, buckthorn, and blueberry wines with tradition and care. Discover our premium collection of handcrafted meads and fruit wines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white font-sans">
        <div className="relative min-h-screen">
          {/* Background Image */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/mestej.jpeg')`,
              backgroundSize: '150%',
              filter: 'brightness(0.3)',
            }}
          />
          
          {/* Navigation */}
          <AnimatePresence>
            {isAgeVerified && (
              <Navigation 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              {isAgeVerified ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  key="main-content"
                >
                  {children}
                </motion.div>
              ) : (
                <div key="age-gate-placeholder" />
              )}
            </AnimatePresence>
          </main>

          {/* Age Gate */}
          <AgeGate
            isOpen={showAgeGate}
            onConfirm={handleAgeConfirm}
            onDeny={handleAgeDeny}
            language={language}
          />

          {/* Footer */}
          <AnimatePresence>
            {isAgeVerified && (
              <motion.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative z-10 glass border-t border-gold/20 mt-20"
              >
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center">
                        <span className="text-sm font-bold text-black">M</span>
                      </div>
                      <span className="font-serif font-semibold golden-text">Mestej Winery</span>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <a 
                        href="https://instagram.com/mestej" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-gold transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://tiktok.com/mestej" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-gold transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </a>
                    </div>
                    
                    <p className="text-sm text-white/60">
                      © 2025 Mestej Winery. All rights reserved.
                    </p>
                  </div>
                </div>
              </motion.footer>
            )}
          </AnimatePresence>
        </div>
      </body>
    </html>
  );
}
