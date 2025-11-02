'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AgeGateProps } from '@/types';
import { content } from '@/lib/content';

interface AgeGateComponentProps extends AgeGateProps {
  language: 'en' | 'sv';
}

export default function AgeGate({ isOpen, onConfirm, onDeny, language }: AgeGateComponentProps) {
  const [showError, setShowError] = useState(false);
  const siteContent = content[language];

  const handleDeny = () => {
    setShowError(true);
    setTimeout(() => {
      onDeny();
    }, 2000);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center age-gate-backdrop"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-md w-full mx-4 p-8 rounded-2xl glass border border-gold/30"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-center space-y-6">
              {/* Logo/Icon */}
              <motion.div
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center"
              >
                <span className="text-2xl">🍯</span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-2xl font-serif font-semibold golden-text"
              >
                {siteContent.ageGate.title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-white/80 leading-relaxed"
              >
                {siteContent.ageGate.message}
              </motion.p>

              {/* Error Message */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200"
                  >
                    {siteContent.ageGate.error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                >
                  {siteContent.ageGate.confirm}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeny}
                  className="flex-1 py-3 px-6 rounded-lg border border-white/30 text-white font-semibold transition-all duration-300 hover:bg-white/10"
                >
                  {siteContent.ageGate.deny}
                </motion.button>
              </motion.div>

              {/* Legal text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-xs text-white/50 pt-4"
              >
                By entering, you confirm that you are of legal drinking age in your jurisdiction.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
