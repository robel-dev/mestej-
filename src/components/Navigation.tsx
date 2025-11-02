'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { content, languages } from '@/lib/content';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';

interface NavigationProps {
  language: 'en' | 'sv';
  onLanguageChange: (lang: 'en' | 'sv') => void;
}

export default function Navigation({ language, onLanguageChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const siteContent = content[language];
  const cartItemCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push(`/${language}`);
    setShowUserMenu(false);
  };

  const baseMenuItems = [
    { label: siteContent.nav.about, href: `/${language}/about` },
    { label: siteContent.nav.history, href: `/${language}/history` },
    { label: siteContent.nav.wines, href: `/${language}/wines` },
    { label: siteContent.nav.webshop, href: `/${language}/webshop` },
    { label: siteContent.nav.contact, href: `/${language}/contact` },
  ];

  // Add login/ordering based on auth status
  const menuItems = user
    ? [
        ...baseMenuItems,
        { label: siteContent.nav.ordering, href: `/${language}/ordering` },
      ]
    : [
        ...baseMenuItems,
        { label: siteContent.nav.login, href: `/${language}/login` },
        { label: siteContent.nav.ordering, href: `/${language}/ordering` },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass border-b border-gold/20' 
            : 'bg-black/70 backdrop-blur-lg border-b border-gold/20'
        }`}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${language}`} className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center"
            >
              <span className="text-xl font-bold text-black">M</span>
            </motion.div>
            <span className="text-xl font-serif font-semibold golden-text hidden sm:block">
              Mestej
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`nav-link text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? 'text-gold'
                      : 'text-white hover:text-gold'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Language Switcher, User Menu, Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Only show for authenticated users */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCart(true)}
                  className="relative p-2 rounded-lg glass border border-gold/30 text-white hover:text-gold transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* User Menu (Desktop) */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="hidden lg:block relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg glass border border-gold/30 text-sm font-medium text-white hover:text-gold transition-colors duration-300"
                >
                  <span className="text-gold">👤</span>
                  <span className="max-w-[120px] truncate">{profile?.email || user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg glass border border-gold/30 overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-white/70 border-b border-gold/20">
                          {profile?.email || user.email}
                        </div>
                        {profile?.status === 'approved' && (
                          <Link
                            href={`/${language}/orders`}
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-white hover:bg-gold/20 transition-colors"
                          >
                            Orders
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/20 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Language Switcher */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLanguageChange(language === 'en' ? 'sv' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg glass border border-gold/30 text-sm font-medium text-white hover:text-gold transition-colors duration-300"
              >
                <span>{languages[language].flag}</span>
                <span>{languages[language].code.toUpperCase()}</span>
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass border border-gold/30 text-white"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gold/20 bg-black/90 backdrop-blur-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 text-base font-medium transition-colors duration-300 ${
                        pathname === item.href
                          ? 'text-gold'
                          : 'text-white hover:text-gold'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Menu */}
                {user && (
                  <>
                    <div className="border-t border-gold/20 pt-4 mt-4">
                      <div className="px-2 py-2 text-sm text-white/70">
                        {profile?.email || user.email}
                      </div>
                      {profile?.status === 'approved' && (
                        <Link
                          href={`/${language}/orders`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-base font-medium text-white hover:text-gold transition-colors duration-300"
                        >
                          Orders
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left py-2 text-base font-medium text-red-400 hover:text-red-300 transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>

    {/* Cart Sidebar */}
    <CartSidebar
      isOpen={showCart}
      onClose={() => setShowCart(false)}
      locale={language}
    />
  </>
  );
}
