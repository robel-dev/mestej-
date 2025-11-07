import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to handle authentication redirect logic
 * Redirects unauthenticated users to login page
 */
export function useAuthRedirect(locale: 'en' | 'sv') {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, locale, router]);

  return { user, authLoading };
}
