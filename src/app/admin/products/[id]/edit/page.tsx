'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { fetchProductById, updateProduct, fetchSuppliers } from '@/lib/supabase/adminProducts';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_type: 'wine' as 'wine' | 'liquor' | 'merchandise',
    supplier_id: '',
    image_url: '',
    abv: '',
    volume_ml: '',
    stock_quantity: '0',
    availability: 'in_stock' as 'in_stock' | 'out_of_stock',
    price: '',
    currency: 'SEK',
  });

  useEffect(() => {
    if (!authLoading && profile) {
      loadProduct();
      loadSuppliers();
    }
  }, [authLoading, profile, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await fetchProductById(productId);
      
      if (!product) {
        alert('Product not found');
        router.push('/admin/products');
        return;
      }

      setFormData({
        name: product.name,
        description: product.description || '',
        product_type: product.product_type,
        supplier_id: product.supplier_id || '',
        image_url: product.image_url || '',
        abv: product.abv?.toString() || '',
        volume_ml: product.volume_ml?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        availability: product.availability,
        price: product.price?.toString() || '',
        currency: product.currency || 'SEK',
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert('You must be logged in as admin');
      return;
    }

    setSaving(true);

    try {
      const result = await updateProduct(
        profile.id,
        productId,
        {
          name: formData.name,
          description: formData.description || null,
          product_type: formData.product_type,
          supplier_id: formData.supplier_id || null,
          image_url: formData.image_url || null,
          abv: formData.abv ? parseFloat(formData.abv) : null,
          volume_ml: formData.volume_ml ? parseInt(formData.volume_ml) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          availability: formData.availability,
        },
        formData.price ? parseFloat(formData.price) : undefined,
        formData.currency
      );

      if (result.success) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Product</h1>
              <p className="text-slate-400">Update product details</p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-slate-800 rounded-xl p-8 border border-slate-700"
            >
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-white font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Product Type & Supplier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Product Type *</label>
                    <select
                      required
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wine">Wine</option>
                      <option value="liquor">Liquor</option>
                      <option value="merchandise">Merchandise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Supplier</label>
                    <select
                      value={formData.supplier_id}
                      onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select supplier...</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ABV & Volume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">ABV (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.abv}
                      onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Volume (ml)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.volume_ml}
                      onChange={(e) => setFormData({ ...formData, volume_ml: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Price & Currency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SEK">SEK</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                {/* Stock & Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Availability *</label>
                    <select
                      required
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-white font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </div>
        </main>
      </div>
    </div>
  );
}

