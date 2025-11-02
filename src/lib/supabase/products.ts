'use client';

import { createClient } from './client';

// Export type separately to avoid SSR issues
export type ProductWithPrice = {
  id: string;
  name: string;
  description: string | null;
  product_type: 'wine' | 'liquor' | 'merchandise';
  supplier_id: string | null;
  image_url: string | null;
  abv: number | null;
  volume_ml: number | null;
  stock_quantity: number;
  availability: 'in_stock' | 'out_of_stock';
  created_at: string;
  price: number | null;
  currency: string;
};

interface ProductPrice {
  price: number;
  currency: string;
  valid_from: string;
  valid_to: string | null;
}

interface ProductWithPricesRaw {
  id: string;
  name: string;
  description: string | null;
  product_type: 'wine' | 'liquor' | 'merchandise';
  supplier_id: string | null;
  image_url: string | null;
  abv: number | null;
  volume_ml: number | null;
  stock_quantity: number;
  availability: 'in_stock' | 'out_of_stock';
  created_at: string;
  product_prices: ProductPrice[];
}

/**
 * Fetch all products with their current prices
 * @param productType Optional filter by product type (wine/liquor/merchandise)
 * @param onlyAvailable If true, only return products with availability = 'in_stock'
 */
export async function fetchProducts(
  productType?: 'wine' | 'liquor' | 'merchandise',
  onlyAvailable: boolean = true
): Promise<ProductWithPrice[]> {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    console.error('fetchProducts can only be called from client components');
    return [];
  }

  const supabase = createClient();

  try {
    // First, get products without nested select to avoid issues
    let query = supabase
      .from('products')
      .select('*');

    // Filter by product type if specified
    if (productType) {
      query = query.eq('product_type', productType);
    }

    // Filter by availability if requested
    if (onlyAvailable) {
      query = query.eq('availability', 'in_stock');
    }

    // Execute query
    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No data returned from products query');
      return [];
    }

    console.log(`Fetched ${data.length} products from database`);

    // Now fetch prices separately for products that have them
    const productIds = (data as any[]).map(p => p.id);
    const { data: pricesData } = await supabase
      .from('product_prices')
      .select('*')
      .in('product_id', productIds);

    // Create a map of product_id -> prices
    const priceMap = new Map<string, any[]>();
    if (pricesData) {
      (pricesData as any[]).forEach(price => {
        if (!priceMap.has(price.product_id)) {
          priceMap.set(price.product_id, []);
        }
        priceMap.get(price.product_id)!.push(price);
      });
    }

    // Process the data to get current prices
    const productsWithPrices: ProductWithPrice[] = data.map((product: any) => {
      // Get prices for this product
      const prices = priceMap.get(product.id) || [];
      const now = new Date();
      
      // Find the current valid price (valid_from <= now AND (valid_to IS NULL OR valid_to >= now))
      const currentPrice = prices.length > 0
        ? prices
            .filter((price: any) => {
              if (!price.valid_from) return false;
              const validFrom = new Date(price.valid_from);
              const validTo = price.valid_to ? new Date(price.valid_to) : null;
              return validFrom <= now && (!validTo || validTo >= now);
            })
            .sort((a: any, b: any) => {
              // Sort by valid_from descending to get the most recent
              return new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime();
            })[0]
        : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        product_type: product.product_type,
        supplier_id: product.supplier_id,
        image_url: product.image_url,
        abv: product.abv,
        volume_ml: product.volume_ml,
        stock_quantity: product.stock_quantity,
        availability: product.availability,
        created_at: product.created_at,
        price: currentPrice?.price || null,
        currency: currentPrice?.currency || 'SEK',
      };
    });

    console.log(`Processed ${productsWithPrices.length} products with prices`);
    return productsWithPrices;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID with current price
 */
export async function fetchProductById(productId: string): Promise<ProductWithPrice | null> {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    console.error('fetchProductById can only be called from client components');
    return null;
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_prices (
          price,
          currency,
          valid_from,
          valid_to
        )
      `)
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const product = data as ProductWithPricesRaw;

    // Get the most recent valid price
    const prices = product.product_prices || [];
    const now = new Date();
    
    const currentPrice = prices
      .filter((price) => {
        const validFrom = new Date(price.valid_from);
        const validTo = price.valid_to ? new Date(price.valid_to) : null;
        return validFrom <= now && (!validTo || validTo >= now);
      })
      .sort((a, b) => {
        return new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime();
      })[0];

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      product_type: product.product_type,
      supplier_id: product.supplier_id,
      image_url: product.image_url,
      abv: product.abv,
      volume_ml: product.volume_ml,
      stock_quantity: product.stock_quantity,
      availability: product.availability,
      created_at: product.created_at,
      price: currentPrice?.price || null,
      currency: currentPrice?.currency || 'SEK',
    };
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
}

