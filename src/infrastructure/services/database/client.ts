'use client';

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton instance to prevent multiple client instances
let supabaseInstance: SupabaseClient<Database> | null = null;

export function createClient() {
  // Return existing instance if already created
  if (supabaseInstance) {
    console.log('♻️ Reusing existing Supabase client instance');
    return supabaseInstance;
  }

  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be called from client components');
  }

  // Validate environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔧 Creating Supabase client (singleton mode) with:', { 
    url: url?.substring(0, 40) + '...', 
    hasKey: !!key,
    keyLength: key?.length 
  });

  if (!url || !key) {
    console.error('❌ Missing Supabase environment variables:', { hasUrl: !!url, hasKey: !!key });
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  }

  // Create the client instance
  supabaseInstance = createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'mestej-auth',
    },
  });
  
  console.log('✅ Supabase client created successfully (singleton mode)');
  
  return supabaseInstance;
}

