'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/services/database/client';
import type { User } from '@supabase/supabase-js';

interface AdminProfile {
  id: string;
  email: string;
  role: 'admin';
  status: 'approved';
}

interface AdminAuthContextType {
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const router = useRouter();

  // Initialize Supabase client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = createClient();
      setSupabase(client);
    }
  }, []);

  // Load user and profile
  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;

    const loadAdminProfile = async (userId: string) => {
      // Prevent concurrent profile loads
      if (profileLoading) {
        console.log('⏭️ Profile already loading, skipping...');
        return;
      }

      try {
        setProfileLoading(true);
        console.log('📋 Loading admin profile for:', userId);
        const startTime = Date.now();
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        const duration = Date.now() - startTime;
        console.log(`⏱️ Profile query took: ${duration}ms`);

        if (error) {
          console.error('❌ Error loading profile:', error);
          setProfile(null);
          setLoading(false);
          setProfileLoading(false);
          // Redirect to login if profile load fails
          router.push('/admin/login');
          return;
        }

        if (data.role !== 'admin') {
          console.error('❌ User is not an admin');
          setProfile(null);
          setLoading(false);
          setProfileLoading(false);
          // Sign out and redirect if not admin
          await supabase.auth.signOut();
          router.push('/admin/login');
          return;
        }

        console.log('✅ Admin profile loaded:', data.email);
        setProfile(data as AdminProfile);
        setLoading(false);
        setProfileLoading(false);
      } catch (error) {
        console.error('❌ Exception loading profile:', error);
        setProfile(null);
        setLoading(false);
        setProfileLoading(false);
      }
    };

    // Check current user
    supabase.auth.getUser().then(({ data: { user: currentUser }, error }) => {
      if (!isMounted) return;

      if (error || !currentUser) {
        console.log('👥 No admin user found');
        setLoading(false);
        return;
      }

      console.log('👤 Admin user found:', currentUser.email);
      setUser(currentUser);
      loadAdminProfile(currentUser.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('🔔 Admin auth state changed:', event);

      // Ignore TOKEN_REFRESHED events to prevent unnecessary re-renders
      if (event === 'TOKEN_REFRESHED') {
        console.log('⏭️ Ignoring TOKEN_REFRESHED event');
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        router.push('/admin/login');
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await loadAdminProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshProfile = async () => {
    if (user && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data && data.role === 'admin') {
          setProfile(data as AdminProfile);
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

