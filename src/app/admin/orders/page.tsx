'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { fetchAllOrders, fulfillOrder, cancelOrder, type OrderWithDetails } from '@/lib/supabase/adminOrders';

export default function AdminOrdersPage() {
  const { user, profile, loading: authLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'placed' | 'paid' | 'fulfilled' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && profile) {
      setOrdersLoaded(false); // Reset when filter changes
      loadOrders();
    }
  }, [authLoading, profile, filter]);

  const loadOrders = async () => {
    if (ordersLoaded) return; // Skip if already loaded
    
    try {
      setLoading(true);
      console.log('🛒 Loading admin orders...');
      const startTime = Date.now();
      
      const data = await fetchAllOrders(filter === 'all' ? undefined : filter);
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Orders query took: ${duration}ms`);
      console.log(`✅ Loaded ${data.length} orders`);
      
      setOrders(data);
      setOrdersLoaded(true);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (orderId: string, orderNumber: string) => {
    if (!profile) return;
    
    if (!confirm(`Mark order ${orderNumber} as fulfilled?`)) {
      return;
    }

    try {
      const result = await fulfillOrder(profile.id, orderId);
      if (result.success) {
        alert('Order fulfilled successfully');
        loadOrders();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fulfilling order:', error);
      alert('Failed to fulfill order');
    }
  };

  const handleCancel = async (orderId: string, orderNumber: string) => {
    if (!profile) return;
    
    const reason = prompt(`Cancel order ${orderNumber}?\n\nEnter reason (optional):`);
    if (reason === null) return; // User cancelled

    try {
      const result = await cancelOrder(profile.id, orderId, reason);
      if (result.success) {
        alert('Order cancelled');
        loadOrders();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = orders.filter(o => o.status === 'placed').length;

  if (authLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <AdminHeader user={profile} />
        
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
              <p className="text-slate-400">
                Manage customer orders
                {pendingCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                    {pendingCount} pending
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order number or customer email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'placed', 'paid', 'fulfilled', 'cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          #{order.order_number || order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{order.user_email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300">{order.item_count || 0} items</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">
                          {order.total_amount.toFixed(2)} SEK
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'fulfilled' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'placed' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all"
                          >
                            View
                          </Link>
                          {(order.status === 'placed' || order.status === 'paid') && (
                            <>
                              <button
                                onClick={() => handleFulfill(order.id, order.order_number || order.id.slice(0, 8))}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-all"
                              >
                                Fulfill
                              </button>
                              <button
                                onClick={() => handleCancel(order.id, order.order_number || order.id.slice(0, 8))}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 text-slate-400 text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </main>
      </div>
    </div>
  );
}

