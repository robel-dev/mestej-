// Admin product management functions
import { createClient } from './client';
import type { Database } from './database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductPrice = Database['public']['Tables']['product_prices']['Row'];

export interface ProductWithPrice extends Product {
  price: number | null;
  currency: string;
}

/**
 * Fetch all products with their current prices
 */
export async function fetchAllProducts(): Promise<ProductWithPrice[]> {
  try {
    const supabase = createClient() as any;
    
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    if (!products || products.length === 0) {
      return [];
    }
    
    // Fetch current prices for all products
    const { data: prices, error: pricesError } = await supabase
      .from('product_prices')
      .select('*')
      .in('product_id', products.map((p: Product) => p.id))
      .is('valid_to', null)
      .order('valid_from', { ascending: false });
    
    if (pricesError) {
      console.error('Error fetching prices:', pricesError);
      // Continue without prices
    }
    
    // Merge products with their prices
    const productsWithPrices: ProductWithPrice[] = products.map((product: Product) => {
      const price = prices?.find((p: ProductPrice) => p.product_id === product.id);
      return {
        ...product,
        price: price?.price || null,
        currency: price?.currency || 'SEK',
      };
    });
    
    return productsWithPrices;
  } catch (error) {
    console.error('Exception in fetchAllProducts:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID with its current price
 */
export async function fetchProductById(productId: string): Promise<ProductWithPrice | null> {
  try {
    const supabase = createClient() as any;
    
    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error('Error fetching product:', productError);
      throw productError;
    }
    
    if (!product) {
      return null;
    }
    const typedProduct = product as Product;
    
    // Fetch current price
    const { data: price, error: priceError } = await supabase
      .from('product_prices')
      .select('*')
      .eq('product_id', productId)
      .is('valid_to', null)
      .order('valid_from', { ascending: false })
      .limit(1)
      .maybeSingle();
    const typedPrice = price as ProductPrice | null;
    
    if (priceError) {
      console.error('Error fetching price:', priceError);
    }
    
    return {
      ...typedProduct,
      price: typedPrice?.price || null,
      currency: typedPrice?.currency || 'SEK',
    };
  } catch (error) {
    console.error('Exception in fetchProductById:', error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  adminId: string,
  productData: {
    name: string;
    description?: string;
    product_type: 'wine' | 'liquor' | 'merchandise';
    supplier_id?: string;
    image_url?: string;
    abv?: number;
    volume_ml?: number;
    stock_quantity?: number;
    availability?: 'in_stock' | 'out_of_stock';
  },
  price?: number,
  currency: string = 'SEK'
): Promise<{ product: Product; success: boolean; error?: string }> {
  try {
    const supabase = createClient() as any;
    
    // Insert product
    const newProduct: ProductInsert = {
      name: productData.name,
      description: productData.description,
      product_type: productData.product_type,
      supplier_id: productData.supplier_id,
      image_url: productData.image_url,
      abv: productData.abv,
      volume_ml: productData.volume_ml,
      stock_quantity: productData.stock_quantity || 0,
      availability: productData.availability || 'in_stock',
    };
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();
    
    if (productError) {
      console.error('Error creating product:', productError);
      return { product: null as any, success: false, error: productError.message };
    }
    
    // Create price if provided
    if (price && product) {
      const { error: priceError } = await supabase
        .from('product_prices')
        .insert({
          product_id: product.id,
          price: price,
          currency: currency,
          valid_from: new Date().toISOString(),
        });
      
      if (priceError) {
        console.error('Error creating price:', priceError);
        // Continue - product was created successfully
      }
    }
    
    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_admin_id: adminId,
      p_action: 'created_product',
      p_resource_type: 'product',
      p_resource_id: product!.id,
      p_metadata: {
        product_name: productData.name,
        product_type: productData.product_type,
      },
    });
    
    return { product: product!, success: true };
  } catch (error) {
    console.error('Exception in createProduct:', error);
    return { 
      product: null as any, 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update a product
 */
export async function updateProduct(
  adminId: string,
  productId: string,
  updates: ProductUpdate,
  newPrice?: number,
  currency: string = 'SEK'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient() as any;
    
    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId);
    
    if (productError) {
      console.error('Error updating product:', productError);
      return { success: false, error: productError.message };
    }
    
    // Update price if provided
    if (newPrice !== undefined) {
      // End current price
      const { error: endPriceError } = await supabase
        .from('product_prices')
        .update({ valid_to: new Date().toISOString() })
        .eq('product_id', productId)
        .is('valid_to', null);
      
      if (endPriceError) {
        console.error('Error ending current price:', endPriceError);
      }
      
      // Create new price
      const { error: newPriceError } = await supabase
        .from('product_prices')
        .insert({
          product_id: productId,
          price: newPrice,
          currency: currency,
          valid_from: new Date().toISOString(),
        });
      
      if (newPriceError) {
        console.error('Error creating new price:', newPriceError);
      }
    }
    
    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_admin_id: adminId,
      p_action: 'updated_product',
      p_resource_type: 'product',
      p_resource_id: productId,
      p_metadata: {
        updates: updates,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Exception in updateProduct:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete a product (soft delete by marking as out_of_stock)
 */
export async function deleteProduct(
  adminId: string,
  productId: string,
  hardDelete: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient() as any;
    
    if (hardDelete) {
      // Hard delete - actually remove from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Soft delete - mark as out of stock
      const { error } = await supabase
        .from('products')
        .update({ availability: 'out_of_stock' })
        .eq('id', productId);
      
      if (error) {
        console.error('Error soft-deleting product:', error);
        return { success: false, error: error.message };
      }
    }
    
    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_admin_id: adminId,
      p_action: hardDelete ? 'deleted_product' : 'soft_deleted_product',
      p_resource_type: 'product',
      p_resource_id: productId,
      p_metadata: {},
    });
    
    return { success: true };
  } catch (error) {
    console.error('Exception in deleteProduct:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch all suppliers
 */
export async function fetchSuppliers() {
  try {
    const supabase = createClient() as any;
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in fetchSuppliers:', error);
    throw error;
  }
}
