'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/contexts/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function CartSidebar({ isOpen, onClose, locale }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-lg border-l border-gold/30 z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <h2 className="text-2xl font-serif font-bold golden-text">
                  Shopping Cart
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-white/10 border border-gold/30 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center">
                      <span className="text-3xl">🛒</span>
                    </div>
                    <p className="text-white/70 text-lg mb-4">Your cart is empty</p>
                    <Link
                      href={`/${locale}/ordering`}
                      onClick={onClose}
                      className="text-gold hover:text-warm-gold underline transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item: CartItem) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-lg glass border border-gold/30 p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gold/20 to-warm-gold/20 flex items-center justify-center flex-shrink-0">
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">🍷</span>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-serif font-bold golden-text mb-1 line-clamp-2">
                              {item.product.name}
                            </h3>
                            {item.product.price && (
                              <p className="text-gold font-semibold mb-2">
                                {item.product.price.toFixed(2)} {item.product.currency}
                              </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 rounded bg-white/10 border border-gold/30 text-white hover:bg-white/20 flex items-center justify-center text-sm"
                              >
                                −
                              </motion.button>
                              <span className="text-white font-semibold min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={item.product.availability === 'out_of_stock'}
                                className="w-8 h-8 rounded bg-white/10 border border-gold/30 text-white hover:bg-white/20 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.product.id)}
                                className="ml-auto text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </motion.button>
                            </div>

                            {/* Line Total */}
                            {item.product.price && (
                              <p className="text-white/60 text-xs mt-2">
                                Total: {(item.product.price * item.quantity).toFixed(2)} {item.product.currency}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gold/20 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Subtotal:</span>
                    <span className="text-2xl font-bold golden-text">
                      {getSubtotal().toFixed(2)} SEK
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href={`/${locale}/checkout`}
                      onClick={onClose}
                      className="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                    >
                      Proceed to Checkout
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearCart}
                      className="w-full px-6 py-2 rounded-lg border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300"
                    >
                      Clear Cart
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

