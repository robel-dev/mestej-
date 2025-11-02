'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminHeaderProps {
  user: {
    email: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { signOut } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar (Placeholder) */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative ml-4">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white text-sm font-medium hidden md:block">
              {user.email}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-700 border border-slate-600 shadow-xl overflow-hidden z-50"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-slate-400 border-b border-slate-600">
                    {user.email}
                  </div>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-slate-600 transition-colors"
                  >
                    Settings
                  </a>
                  <a
                    href="/admin/activity"
                    className="block px-4 py-2 text-sm text-white hover:bg-slate-600 transition-colors"
                  >
                    Activity Log
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

