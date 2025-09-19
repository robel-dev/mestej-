'use client';

import { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';

export default function WinesPage() {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'sv' || 'en';
    setLanguage(savedLanguage);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <ProductGallery language={language} />
    </div>
  );
}
