'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function TestProfilePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testProfileFetch = async () => {
    setLoading(true);
    setResult(null);
    console.log('🧪 Testing profile fetch...');

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // First get the current user
      console.log('1️⃣ Getting current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setResult({ error: 'User error: ' + userError.message });
        return;
      }

      if (!user) {
        setResult({ error: 'No user logged in' });
        return;
      }

      console.log('✅ User:', user.email, user.id);

      // Now fetch profile
      console.log('2️⃣ Fetching profile for user:', user.id);
      const startTime = Date.now();
      
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const endTime = Date.now();
      console.log(`⏱️ Profile fetch took: ${endTime - startTime}ms`);

      if (profileError) {
        console.error('❌ Profile error:', profileError);
        setResult({ 
          user: { email: user.email, id: user.id },
          profileError: {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
          }
        });
        return;
      }

      console.log('✅ Profile:', profile);
      setResult({ 
        user: { email: user.email, id: user.id },
        profile: profile,
        timing: `${endTime - startTime}ms`
      });
    } catch (err) {
      console.error('❌ Exception:', err);
      setResult({ exception: err instanceof Error ? err.message : String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-gold">🧪 Profile Fetch Test</h1>
      
      <button
        onClick={testProfileFetch}
        disabled={loading}
        className="px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-warm-gold disabled:opacity-50 mb-8"
      >
        {loading ? 'Testing...' : 'Test Profile Fetch'}
      </button>

      {result && (
        <div className="p-6 rounded-lg glass border border-gold/30">
          <h2 className="text-xl font-bold mb-4">Result:</h2>
          <pre className="text-sm overflow-auto bg-black/50 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-6 rounded-lg glass border border-gold/30">
        <h2 className="text-xl font-bold mb-4">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-white/70">
          <li>Make sure you're logged in first</li>
          <li>Click "Test Profile Fetch"</li>
          <li>Check the result and console</li>
          <li>This will tell us exactly why profile isn't loading</li>
        </ol>
      </div>
    </div>
  );
}

