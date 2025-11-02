'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function DebugAuthPage() {
  const { user, profile, loading } = useAuth();

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-gold">🔍 Auth Debug Page</h1>
      
      <div className="space-y-6">
        {/* Loading State */}
        <div className="p-6 rounded-lg glass border border-gold/30">
          <h2 className="text-xl font-bold mb-4">Loading State</h2>
          <div className="space-y-2">
            <p>Auth Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading ? 'Yes ⏳' : 'No ✅'}</span></p>
          </div>
        </div>

        {/* User State */}
        <div className="p-6 rounded-lg glass border border-gold/30">
          <h2 className="text-xl font-bold mb-4">User State</h2>
          <div className="space-y-2">
            <p>Has User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Yes ✅' : 'No ❌'}</span></p>
            {user && (
              <>
                <p>Email: <span className="text-white/70">{user.email}</span></p>
                <p>User ID: <span className="text-white/70 text-xs">{user.id}</span></p>
              </>
            )}
          </div>
        </div>

        {/* Profile State */}
        <div className="p-6 rounded-lg glass border border-gold/30">
          <h2 className="text-xl font-bold mb-4">Profile State</h2>
          <div className="space-y-2">
            <p>Has Profile: <span className={profile ? 'text-green-400' : 'text-red-400'}>{profile ? 'Yes ✅' : 'No ❌'}</span></p>
            {profile && (
              <>
                <p>Email: <span className="text-white/70">{profile.email}</span></p>
                <p>Status: <span className={`font-bold ${profile.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>{profile.status}</span></p>
                <p>Role: <span className="text-white/70">{profile.role}</span></p>
              </>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 rounded-lg glass border border-gold/30">
          <h2 className="text-xl font-bold mb-4">Status</h2>
          {loading && (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent"
              />
              <p className="text-yellow-400">Loading authentication...</p>
            </div>
          )}
          {!loading && !user && (
            <p className="text-red-400">❌ Not authenticated. Please <a href="/en/login" className="underline">log in</a>.</p>
          )}
          {!loading && user && !profile && (
            <p className="text-yellow-400">⚠️ User authenticated but profile not loaded. Check console for errors.</p>
          )}
          {!loading && user && profile && profile.status !== 'approved' && (
            <p className="text-yellow-400">⚠️ Profile status: {profile.status}. Waiting for approval.</p>
          )}
          {!loading && user && profile && profile.status === 'approved' && (
            <p className="text-green-400">✅ Everything is working! You should be able to access the catalog.</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a href="/en/login" className="block w-full px-6 py-3 bg-gradient-to-r from-gold to-warm-gold text-black font-bold rounded-lg text-center hover:opacity-90">
            Go to Login
          </a>
          <a href="/en/catalog" className="block w-full px-6 py-3 glass border border-gold/30 text-white font-bold rounded-lg text-center hover:bg-white/10">
            Go to Catalog
          </a>
          <a href="/test-products" className="block w-full px-6 py-3 glass border border-gold/30 text-white font-bold rounded-lg text-center hover:bg-white/10">
            Test Products (No Auth)
          </a>
        </div>
      </div>
    </div>
  );
}

