'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';

export default function AdminDashboardPage() {
  const { user, profile, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <AdminHeader user={profile} />
        
        <main className="p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile.email}
            </h1>
            <p className="text-slate-400">
              Here's what's happening with your store today
            </p>
          </motion.div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <QuickActionCard
              title="Add Product"
              description="Add a new wine or liquor"
              icon="📦"
              href="/admin/products/new"
              color="blue"
            />
            <QuickActionCard
              title="Manage Users"
              description="Approve pending users"
              icon="👥"
              href="/admin/users"
              color="green"
            />
            <QuickActionCard
              title="View Orders"
              description="Process customer orders"
              icon="🛒"
              href="/admin/orders"
              color="purple"
            />
            <QuickActionCard
              title="Settings"
              description="Configure website"
              icon="⚙️"
              href="/admin/settings"
              color="gray"
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'blue' | 'green' | 'purple' | 'gray';
}

function QuickActionCard({ title, description, icon, href, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    gray: 'from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800',
  };

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`block p-6 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg transition-all duration-300`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </motion.a>
  );
}

