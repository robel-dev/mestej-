'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/presentation/contexts/CartContext';
import { content } from '@/shared/constants/content';
import type { ProductWithPrice } from '@/infrastructure/services/database/products';

const PRODUCTS_PER_PAGE = 12;

// Lazy import to avoid SSR issues
let fetchProductsFn: ((productType?: 'wine' | 'liquor' | 'merchandise', onlyAvailable?: boolean) => Promise<ProductWithPrice[]>) | null = null;

async function getFetchProducts() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!fetchProductsFn) {
    const module = await import('@/infrastructure/services/database/products');
    fetchProductsFn = module.fetchProducts;
  }
  return fetchProductsFn;
}

interface CatalogPageProps {
  params: Promise<{ locale: string }>;
}

export default function CatalogPage({ params }: CatalogPageProps) {
  const [locale, setLocale] = useState<'en' | 'sv'>('en');
  const [allProducts, setAllProducts] = useState<ProductWithPrice[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithPrice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'wine' | 'liquor' | 'merchandise'>('all');
  const [productsLoaded, setProductsLoaded] = useState(false);
  const { addItem, getItemQuantity, updateQuantity } = useCart();

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      const validLocale = (paramLocale === 'sv') ? 'sv' : 'en';
      setLocale(validLocale);
    });
  }, [params]);

  useEffect(() => {
    // Load products on mount (no auth required)
    if (!productsLoaded) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter products when filter changes
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.product_type === selectedType));
    }
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [selectedType, allProducts]);

  const loadProducts = async () => {
    if (productsLoaded) {
      console.log('⏸️ Products already loaded, skipping');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📦 Fetching all products (one-time fetch)...');

      const fetchProducts = await getFetchProducts();
      if (!fetchProducts) {
        throw new Error('Failed to load products module');
      }

      // Fetch ALL products (wines, liquors, merchandise)
      // This happens ONCE and then we filter/paginate in memory
      const wineProducts = await fetchProducts('wine');
      console.log('✅ Wine products:', wineProducts.length);
      const liquorProducts = await fetchProducts('liquor');
      console.log('✅ Liquor products:', liquorProducts.length);
      const merchProducts = await fetchProducts('merchandise');
      console.log('✅ Merchandise:', merchProducts.length);

      const fetchedProducts = [...wineProducts, ...liquorProducts, ...merchProducts];
      console.log('✅ Total products:', fetchedProducts.length);
      setAllProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setProductsLoaded(true);
    } catch (err) {
      console.error('❌ Error loading products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const siteContent = content[locale];

  // Product Cart Controls Component
  interface ProductCartControlsProps {
    product: ProductWithPrice;
    quantity: number;
    onAdd: () => void;
    onUpdate: (qty: number) => void;
  }

  const ProductCartControls = ({ product, quantity, onAdd, onUpdate }: ProductCartControlsProps) => {
    const [localQuantity, setLocalQuantity] = useState(quantity);

    useEffect(() => {
      setLocalQuantity(quantity);
    }, [quantity]);

    const handleIncrement = () => {
      const newQty = localQuantity + 1;
      setLocalQuantity(newQty);
      onUpdate(newQty);
    };

    const handleDecrement = () => {
      if (localQuantity > 1) {
        const newQty = localQuantity - 1;
        setLocalQuantity(newQty);
        onUpdate(newQty);
      } else {
        onUpdate(0);
      }
    };

    if (quantity === 0) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          disabled={product.availability === 'out_of_stock'}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {product.availability === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          className="w-10 h-10 rounded-lg glass border border-gold/30 text-white hover:text-gold flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </motion.button>

        <span className="text-white font-semibold w-12 text-center">{localQuantity}</span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          className="w-10 h-10 rounded-lg glass border border-gold/30 text-white hover:text-gold flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center"
        >
          <span className="text-2xl">🍯</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold golden-text mb-4">
            Product Catalog
          </h1>
          <p className="text-xl text-white/80">
            Browse our complete collection of wines, liquors, and merchandise
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {(['all', 'wine', 'liquor', 'merchandise'] as const).map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${selectedType === type
                  ? 'bg-gradient-to-r from-gold to-warm-gold text-black font-semibold'
                  : 'glass border border-gold/30 text-white hover:text-gold'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Pagination Info */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center text-white/70"
          >
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center">
              <span className="text-3xl">🍷</span>
            </div>
            <p className="text-white/70 text-lg">
              No products found for the selected filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass border border-gold/30 overflow-hidden hover:border-gold/50 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-gold/20 to-warm-gold/20 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">
                        {product.product_type === 'wine' ? '🍷' : product.product_type === 'liquor' ? '🥃' : '📦'}
                      </span>
                    )}
                    {product.availability === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold golden-text mb-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                      {product.abv && (
                        <span>ABV: {product.abv}%</span>
                      )}
                      {product.volume_ml && (
                        <span>{product.volume_ml}ml</span>
                      )}
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="space-y-4">
                      <div>
                        {product.price ? (
                          <span className="text-2xl font-bold golden-text">
                            {product.price.toFixed(2)} {product.currency}
                          </span>
                        ) : (
                          <span className="text-white/60 text-sm">Price on request</span>
                        )}
                      </div>

                      {product.price && (
                        <ProductCartControls
                          product={product}
                          quantity={getItemQuantity(product.id)}
                          onAdd={() => addItem(product, 1)}
                          onUpdate={(qty) => updateQuantity(product.id, qty)}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex justify-center items-center gap-2"
              >
                {/* Previous Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg glass border border-gold/30 text-white hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    const showEllipsis =
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2);

                    if (!showPage && !showEllipsis) return null;

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-3 py-2 text-white/50">
                          ...
                        </span>
                      );
                    }

                    return (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-all ${currentPage === page
                            ? 'bg-gradient-to-r from-gold to-warm-gold text-black font-semibold'
                            : 'glass border border-gold/30 text-white hover:text-gold'
                          }`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg glass border border-gold/30 text-white hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
