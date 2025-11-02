'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Get user's preferred language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en';
    const preferredLanguage = savedLanguage === 'sv' ? 'sv' : 'en';
    
    // Redirect to the localized route
    router.replace(`/${preferredLanguage}`);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-gold flex items-center justify-center animate-spin">
        <span className="text-2xl">🍯</span>
      </div>
    </div>
  );
}