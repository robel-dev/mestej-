// Admin user management functions
import { createClient } from './client';
import type { Database } from './database.types';

type User = Database['public']['Tables']['users']['Row'];

export interface UserWithStats extends User {
  order_count?: number;
  total_spent?: number;
}

/**
 * Fetch all users with optional filtering
 */
export async function fetchAllUsers(status?: 'pending' | 'approved' | 'rejected' | 'blocked'): Promise<UserWithStats[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: users, error } = await query;
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return users || [];
  } catch (error) {
    console.error('Exception in fetchAllUsers:', error);
    throw error;
  }
}

/**
 * Approve a user
 */
export async function approveUser(
  adminId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Call the approve_user function
    const { data, error } = await supabase.rpc('approve_user', {
      p_user_id: userId,
      p_admin_id: adminId,
    });
    
    if (error) {
      console.error('Error approving user:', error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      return { success: false, error: 'User not found or already approved' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception in approveUser:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Reject a user
 */
export async function rejectUser(
  adminId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Call the reject_user function
    const { data, error } = await supabase.rpc('reject_user', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_reason: reason || null,
    });
    
    if (error) {
      console.error('Error rejecting user:', error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      return { success: false, error: 'User not found or already rejected' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception in rejectUser:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Block a user
 */
export async function blockUser(
  adminId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Call the block_user function
    const { data, error } = await supabase.rpc('block_user', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_reason: reason || null,
    });
    
    if (error) {
      console.error('Error blocking user:', error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception in blockUser:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Unblock a user (revert to approved status)
 */
export async function unblockUser(
  adminId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Update user status to approved
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'approved',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error unblocking user:', error);
      return { success: false, error: error.message };
    }
    
    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_admin_id: adminId,
      p_action: 'unblock_user',
      p_resource_type: 'user',
      p_resource_id: userId,
      p_metadata: {},
    });
    
    return { success: true };
  } catch (error) {
    console.error('Exception in unblockUser:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

