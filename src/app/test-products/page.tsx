'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function TestProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    console.log('🧪 Testing direct product fetch...');

    try {
      // Create client directly
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      console.log('📡 Fetching products...');
      const startTime = Date.now();

      // Direct query without auth
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .limit(10);

      const endTime = Date.now();
      console.log(`⏱️ Fetch took: ${endTime - startTime}ms`);

      if (fetchError) {
        console.error('❌ Error:', fetchError);
        setError(JSON.stringify(fetchError));
        return;
      }

      console.log(`✅ Got ${data?.length || 0} products`);
      setProducts(data || []);
    } catch (err) {
      console.error('❌ Exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-gold">🧪 Database Test Page</h1>
      <p className="mb-4 text-white/70">
        This page tests if we can fetch products directly from Supabase without authentication.
      </p>

      <button
        onClick={testFetch}
        disabled={loading}
        className="px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-warm-gold disabled:opacity-50 mb-4"
      >
        {loading ? 'Loading...' : 'Test Product Fetch'}
      </button>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg mb-4">
          <h3 className="font-bold mb-2">❌ Error:</h3>
          <pre className="text-sm overflow-auto">{error}</pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
          <h3 className="font-bold mb-2">✅ Success! Got {products.length} products:</h3>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="p-2 bg-white/10 rounded">
                <strong>{product.name}</strong>
                <span className="ml-2 text-sm text-white/60">
                  ({product.product_type})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

