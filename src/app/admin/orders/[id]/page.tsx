'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/presentation/contexts/AdminAuthContext';
import AdminSidebar from '@/presentation/components/admin/AdminSidebar';
import AdminHeader from '@/presentation/components/admin/AdminHeader';
import { fetchOrderById, fulfillOrder, cancelOrder, type OrderWithDetails } from '@/infrastructure/services/database/adminOrders';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile) {
      loadOrder();
    }
  }, [authLoading, profile, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(orderId);
      
      if (!data) {
        alert('Order not found');
        router.push('/admin/orders');
        return;
      }
      
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async () => {
    if (!profile || !order) return;
    
    if (!confirm(`Mark order ${order.order_number} as fulfilled?`)) {
      return;
    }

    try {
      const result = await fulfillOrder(profile.id, orderId);
      if (result.success) {
        alert('Order fulfilled successfully');
        loadOrder();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fulfilling order:', error);
      alert('Failed to fulfill order');
    }
  };

  const handleCancel = async () => {
    if (!profile || !order) return;
    
    const reason = prompt(`Cancel order ${order.order_number}?\n\nEnter reason (optional):`);
    if (reason === null) return;

    try {
      const result = await cancelOrder(profile.id, orderId, reason);
      if (result.success) {
        alert('Order cancelled');
        loadOrder();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!user || !profile || !order) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <AdminHeader user={profile} />
        
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <button
                  onClick={() => router.back()}
                  className="text-blue-400 hover:text-blue-300 mb-2 flex items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Orders</span>
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Order #{order.order_number || order.id.slice(0, 8)}
                </h1>
                <p className="text-slate-400">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {(order.status === 'placed' || order.status === 'paid') && (
                  <>
                    <button
                      onClick={handleFulfill}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Fulfill Order
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                        <div className="w-16 h-16 rounded-lg bg-slate-600 flex items-center justify-center text-2xl">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            item.products?.product_type === 'wine' ? '🍷' : '🥃'
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-slate-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{item.price.toFixed(2)} SEK</p>
                          <p className="text-slate-400 text-sm">ea.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{item.subtotal.toFixed(2)} SEK</p>
                          <p className="text-slate-400 text-sm">total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    order.status === 'fulfilled' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'placed' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  
                  {order.fulfilled_at && (
                    <p className="text-slate-400 text-sm mt-4">
                      Fulfilled on {new Date(order.fulfilled_at).toLocaleString()}
                    </p>
                  )}
                </motion.div>

                {/* Customer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Customer</h3>
                  <p className="text-slate-300">{order.user_email}</p>
                  <p className="text-slate-400 text-sm mt-2">User ID: {order.user_id.slice(0, 8)}...</p>
                </motion.div>

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Items</span>
                      <span>{order.item_count}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <span>{order.total_amount.toFixed(2)} SEK</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 mt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>{order.total_amount.toFixed(2)} SEK</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

