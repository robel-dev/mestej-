'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { fetchAllProducts, deleteProduct, type ProductWithPrice } from '@/lib/supabase/adminProducts';

export default function AdminProductsPage() {
  const { user, profile, loading: authLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'wine' | 'liquor' | 'merchandise'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && profile && !productsLoaded) {
      loadProducts();
    }
  }, [authLoading, profile, productsLoaded]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Loading admin products...');
      const startTime = Date.now();
      
      const data = await fetchAllProducts();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Products query took: ${duration}ms`);
      console.log(`✅ Loaded ${data.length} products`);
      
      setProducts(data);
      setProductsLoaded(true);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!profile) return;
    
    if (!confirm(`Are you sure you want to delete "${productName}"? This will mark it as out of stock.`)) {
      return;
    }

    try {
      const result = await deleteProduct(profile.id, productId, false);
      if (result.success) {
        alert('Product deleted successfully');
        setProductsLoaded(false); // Reset flag to reload
        loadProducts();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.product_type === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
              <p className="text-slate-400">Manage your wine and liquor inventory</p>
            </div>
            <Link
              href="/admin/products/new"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              + Add Product
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'wine', 'liquor', 'merchandise'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No products found</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center text-2xl">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              product.product_type === 'wine' ? '🍷' : product.product_type === 'liquor' ? '🥃' : '📦'
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-slate-400 text-sm line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 capitalize">{product.product_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">
                          {product.price ? `${product.price.toFixed(2)} ${product.currency}` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300">{product.stock_quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.availability === 'in_stock'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                          >
                            Delete
                          </button>
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
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </main>
      </div>
    </div>
  );
}

