'use client';

import { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';

interface WinesPageProps {
  params: Promise<{ locale: string }>;
}

export default function WinesPage({ params }: WinesPageProps) {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    params.then(({ locale }) => {
      const validLocale = (locale === 'sv') ? 'sv' : 'en';
      setLanguage(validLocale);
    });
  }, [params]);

  return (
    <div className="min-h-screen pt-20">
      <ProductGallery language={language} />
    </div>
  );
}
