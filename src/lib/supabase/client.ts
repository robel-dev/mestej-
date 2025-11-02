'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export function createClient() {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be called from client components');
  }

  // Validate environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔧 Creating Supabase client (simple mode) with:', { 
    url: url?.substring(0, 40) + '...', 
    hasKey: !!key,
    keyLength: key?.length 
  });

  if (!url || !key) {
    console.error('❌ Missing Supabase environment variables:', { hasUrl: !!url, hasKey: !!key });
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  }

  // Use the simple client instead of SSR client
  // This should work better in the browser and avoid timeout issues
  const client = createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'mestej-auth',
    },
  });
  
  console.log('✅ Supabase client created successfully (simple mode)');
  
  return client;
}

