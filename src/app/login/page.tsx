'use client';

import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-serif font-bold golden-text mb-4">
            Permit Holder Access
          </h1>
          <p className="text-white/80">
            Restricted access for permit holders only.
          </p>
        </div>
        
        <div className="p-6 rounded-2xl glass border border-gold/30">
          <p className="text-white/70 text-sm">
            This section is currently under development. Please contact us for access inquiries.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
