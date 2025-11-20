'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/infrastructure/services/database/client';

interface DashboardStatsData {
  total_revenue: number;
  pending_orders: number;
  pending_users: number;
  total_products: number;
  approved_users: number;
  recent_orders: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    if (!statsLoaded) {
      loadStats();
    }
  }, [statsLoaded]);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      
      console.log('📊 Loading dashboard stats...');
      const startTime = Date.now();
      
      // Call the get_dashboard_stats function
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Stats query took: ${duration}ms`);
      
      if (error) {
        console.error('Error loading stats:', error);
        return;
      }
      
      console.log('✅ Dashboard stats loaded:', data);
      setStats(data);
      setStatsLoaded(true);
    } catch (error) {
      console.error('Exception loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-800 rounded-xl p-6 h-32" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `${stats?.total_revenue?.toFixed(2) || '0.00'} SEK`,
      icon: '💰',
      color: 'from-green-600 to-green-700',
      change: '+12.5%',
    },
    {
      label: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: '🛒',
      color: 'from-blue-600 to-blue-700',
      subtext: 'Need attention',
    },
    {
      label: 'Pending Users',
      value: stats?.pending_users || 0,
      icon: '⏳',
      color: 'from-yellow-600 to-yellow-700',
      subtext: 'Awaiting approval',
    },
    {
      label: 'Total Products',
      value: stats?.total_products || 0,
      icon: '📦',
      color: 'from-purple-600 to-purple-700',
      subtext: 'In catalog',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden"
        >
          <div className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{card.icon}</div>
              {card.change && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {card.change}
                </span>
              )}
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold">{card.value}</p>
              {card.subtext && (
                <p className="text-white/60 text-xs mt-2">{card.subtext}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

