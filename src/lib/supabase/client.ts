'use client';

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export function createClient() {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be called from client components');
  }

  // Validate environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔧 Creating Supabase browser client with:', { 
    url: url?.substring(0, 40) + '...', 
    hasKey: !!key,
    keyLength: key?.length 
  });

  if (!url || !key) {
    console.error('❌ Missing Supabase environment variables:', { hasUrl: !!url, hasKey: !!key });
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  }

  // Use the SSR browser client for proper cookie handling
  const client = createBrowserClient<Database>(url, key);
  
  console.log('✅ Supabase browser client created successfully');
  
  return client;
}

