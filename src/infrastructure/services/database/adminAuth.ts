// Admin authentication utilities
import { createClient } from './client';
import type { Database } from './database.types';
import type { User } from '@supabase/supabase-js';

export interface AdminProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
}
type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return false;
    }
    
    return (profile as UserRow).role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get admin profile for current user
 */
export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single<UserRow>();
    
    if (profileError || !profile) {
      return null;
    }
    
    // Verify user is an admin
    const typedProfile = profile as UserRow;
    if (typedProfile.role !== 'admin') {
      return null;
    }
    
    return typedProfile as AdminProfile;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return null;
  }
}

/**
 * Admin sign in
 */
export async function adminSignIn(email: string, password: string): Promise<{ 
  user: User | null; 
  error: Error | null;
  isAdmin: boolean;
}> {
  try {
    const supabase = createClient();
    
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error || !data.user) {
      return { user: null, error: error || new Error('Login failed'), isAdmin: false };
    }
    
    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single<UserRow>();
    
    if (profileError || !profile) {
      // Sign out if profile fetch fails
      await supabase.auth.signOut();
      return { 
        user: null, 
        error: new Error('Failed to fetch user profile'), 
        isAdmin: false 
      };
    }
    
    // Check if user is admin
    const typedProfile = profile as UserRow;
    if (typedProfile.role !== 'admin') {
      // Sign out if not admin
      await supabase.auth.signOut();
      return { 
        user: null, 
        error: new Error('Unauthorized: Admin access only'), 
        isAdmin: false 
      };
    }
    
    return { user: data.user, error: null, isAdmin: true };
  } catch (error) {
    console.error('Admin sign in error:', error);
    return { 
      user: null, 
      error: error as Error, 
      isAdmin: false 
    };
  }
}

/**
 * Admin sign out
 */
export async function adminSignOut(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Admin sign out error:', error);
  }
}
