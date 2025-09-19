'use client';

import { motion } from 'framer-motion';

export default function OrderingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="text-4xl font-serif font-bold golden-text mb-4">
            Online Ordering
          </h1>
          <p className="text-xl text-white/80">
            Coming soon: search, add to cart, and purchase flow.
          </p>
        </div>
        
        <div className="p-8 rounded-2xl glass border border-gold/30">
          <p className="text-white/70 mb-6">
            We're working on bringing you a seamless online ordering experience. 
            In the meantime, you can find our wines at select restaurants and through Systembolaget.
          </p>
          
          <motion.a
            href="/wines"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold transition-all duration-300"
          >
            Explore Our Wines
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
