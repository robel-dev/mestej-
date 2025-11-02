'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  permit_document_url: string | null;
  approved_by: string | null;
  approved_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    console.log('🎬 AuthProvider mounting...');
    setMounted(true);
    
    // Create client on mount
    if (typeof window !== 'undefined') {
      try {
        console.log('🔧 Creating Supabase client in AuthProvider...');
        const client = createClient();
        setSupabase(client);
        console.log('✅ Supabase client set in AuthProvider');
      } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        setLoading(false);
      }
    }
  }, []);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      console.warn('⚠️ Cannot load profile: Supabase client not ready');
      setLoading(false);
      return;
    }
    
    try {
      console.log('📋 Loading profile for user:', userId);
      console.log('🔍 Supabase client ready:', !!supabase);
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      const endTime = Date.now();
      console.log(`⏱️ Profile query took: ${endTime - startTime}ms`);

      if (error) {
        console.error('❌ Error loading profile:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        setProfile(null);
      } else if (!data) {
        console.error('❌ No profile data returned');
        setProfile(null);
      } else {
        console.log('✅ Profile loaded successfully!');
        console.log('Profile data:', { 
          email: data.email, 
          status: data.status, 
          role: data.role,
          id: data.id 
        });
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('❌ Exception loading profile:', error);
      if (error instanceof Error) {
        console.error('Exception name:', error.name);
        console.error('Exception message:', error.message);
        console.error('Exception stack:', error.stack);
      }
      setProfile(null);
    } finally {
      console.log('🏁 Finishing loadProfile, setting loading to false');
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!mounted) {
      console.log('⏳ AuthContext: waiting for mount');
      return;
    }
    
    if (!supabase) {
      console.log('⏳ AuthContext: waiting for supabase client');
      return;
    }

    console.log('🚀 AuthContext: Setting up auth listener...');
    let isMounted = true;
    let profileLoading = false; // Prevent concurrent profile loads

    // Don't set loading to false immediately - wait for user check to complete
    console.log('⚡ Preparing to check auth state...');

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, { hasSession: !!session, hasUser: !!session?.user, email: session?.user?.email });
      
      if (!isMounted) {
        console.log('⚠️ Component unmounted, ignoring auth change');
        return;
      }

      // Ignore token refresh events to prevent re-renders
      if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed, skipping profile reload');
        return;
      }
      
      if (session?.user) {
        console.log('👤 Setting user from auth state change');
        setUser(session.user);
        
        // Only load profile if not already loading
        if (!profileLoading) {
          profileLoading = true;
          console.log('📋 Loading profile for user:', session.user.id);
          await loadProfile(session.user.id);
          profileLoading = false;
        } else {
          console.log('⏸️ Profile already loading, skipping');
        }
      } else {
        console.log('👥 Auth state change: No user, clearing state');
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Manually check current user on mount (only once)
    console.log('🔍 Checking current user on mount...');
    supabase.auth.getUser().then(({ data: { user: currentUser }, error }) => {
      if (!isMounted) {
        console.log('⚠️ Component unmounted during getUser');
        return;
      }

      if (error) {
        console.error('❌ Error getting current user:', error);
        setLoading(false);
        return;
      }
      
      console.log('✅ Current user on mount:', { hasUser: !!currentUser, email: currentUser?.email });
      
      if (currentUser) {
        setUser(currentUser);
        if (!profileLoading) {
          profileLoading = true;
          console.log('👤 Loading profile for current user on mount:', currentUser.id);
          loadProfile(currentUser.id).finally(() => {
            profileLoading = false;
          });
        }
      } else {
        console.log('👥 No current user on mount');
        setLoading(false);
      }
    }).catch((err) => {
      console.error('❌ Exception getting current user:', err);
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, mounted, loadProfile]);

  const refreshProfile = async () => {
    if (user && supabase) {
      await loadProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return { error: new Error('Client not initialized') };
    }
    
    try {
      console.log('🔑 Signing in with password (simple client)...');
      const startTime = Date.now();
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const endTime = Date.now();
      console.log(`⏱️ Sign in took: ${endTime - startTime}ms`);

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful:', { email: data?.user?.email, userId: data?.user?.id });
      // Profile will be loaded by the auth state change listener
      return { error: null };
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Client not initialized') };
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });

      if (error) {
        return { error };
      }

      // Profile will be created by the database trigger
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

