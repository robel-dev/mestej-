// Admin order management functions
import { createClient } from './client';
import type { Database } from './database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export interface OrderWithDetails extends Order {
  items?: OrderItem[];
  user_email?: string;
  item_count?: number;
}

/**
 * Fetch all orders with optional filtering
 */
export async function fetchAllOrders(status?: string): Promise<OrderWithDetails[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        users!inner(email)
      `)
      .order('created_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data: orders, error } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    if (!orders || orders.length === 0) {
      return [];
    }
    
    // Fetch order items count for each order
    const ordersWithDetails: OrderWithDetails[] = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        
        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
        }
        
        return {
          ...order,
          user_email: (order.users as any)?.email,
          item_count: items?.length || 0,
        };
      })
    );
    
    return ordersWithDetails;
  } catch (error) {
    console.error('Exception in fetchAllOrders:', error);
    throw error;
  }
}

/**
 * Fetch a single order by ID with items
 */
export async function fetchOrderById(orderId: string): Promise<OrderWithDetails | null> {
  try {
    const supabase = createClient();
    
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users!inner(email)
      `)
      .eq('id', orderId)
      .single();
    
    if (orderError) {
      console.error('Error fetching order:', orderError);
      throw orderError;
    }
    
    if (!order) {
      return null;
    }
    
    // Fetch order items with product details
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          product_type,
          image_url
        )
      `)
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }
    
    return {
      ...order,
      user_email: (order.users as any)?.email,
      items: items || [],
      item_count: items?.length || 0,
    };
  } catch (error) {
    console.error('Exception in fetchOrderById:', error);
    throw error;
  }
}

/**
 * Fulfill an order
 */
export async function fulfillOrder(
  adminId: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Call the fulfill_order function
    const { data, error } = await supabase.rpc('fulfill_order', {
      p_order_id: orderId,
      p_admin_id: adminId,
    });
    
    if (error) {
      console.error('Error fulfilling order:', error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      return { success: false, error: 'Order not found or cannot be fulfilled' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception in fulfillOrder:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  adminId: string,
  orderId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Call the cancel_order function
    const { data, error } = await supabase.rpc('cancel_order', {
      p_order_id: orderId,
      p_admin_id: adminId,
      p_reason: reason || null,
    });
    
    if (error) {
      console.error('Error cancelling order:', error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      return { success: false, error: 'Order not found or cannot be cancelled' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception in cancelOrder:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

