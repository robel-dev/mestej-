'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/shared/constants/content';
import Image from 'next/image';

interface ProductsPageProps {
    params: Promise<{ locale: string }>;
}

export default function ProductsPage({ params }: ProductsPageProps) {
    const [language, setLanguage] = useState<'en' | 'sv'>('en');

    useEffect(() => {
        params.then(({ locale }) => {
            const validLocale = (locale === 'sv') ? 'sv' : 'en';
            setLanguage(validLocale);
        });
    }, [params]);

    const siteContent = content[language];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
                        <span className="golden-text">{siteContent.products.title}</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {siteContent.products.subtitle}
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="space-y-32">
                    {siteContent.products.meads.map((mead, index) => (
                        <motion.article
                            key={mead.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                {/* Product Image */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
                                >
                                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glass border border-gold/20 shadow-2xl">
                                        {/* Placeholder for product image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-black/50 to-dark-gold/10 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-8xl mb-4">🍯</div>
                                                <p className="text-gold/60 font-serif text-lg">{mead.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Product Details */}
                                <div className={`space-y-8 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                                    {/* Product Name */}
                                    <div>
                                        <h2 className="text-4xl sm:text-5xl font-serif font-bold golden-text mb-4">
                                            {mead.name}
                                        </h2>
                                        <p className="text-lg text-white/80 leading-relaxed">
                                            {mead.description}
                                        </p>
                                    </div>

                                    {/* Optimal Conditions */}
                                    <div className="glass rounded-2xl p-6 border border-gold/20">
                                        <h3 className="text-2xl font-serif font-semibold golden-text mb-4">
                                            {mead.optimalConditions.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="text-gold mr-3 mt-1">•</span>
                                                <span className="text-white/80">{mead.optimalConditions.serve}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-gold mr-3 mt-1">•</span>
                                                <span className="text-white/80">{mead.optimalConditions.glassware}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-gold mr-3 mt-1">•</span>
                                                <span className="text-white/80">{mead.optimalConditions.servingSize}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Food Pairings */}
                                    <div className="glass rounded-2xl p-6 border border-gold/20">
                                        <h3 className="text-2xl font-serif font-semibold golden-text mb-2">
                                            {mead.foodPairings.title}
                                        </h3>
                                        <p className="text-sm text-gold/80 mb-4 font-medium">
                                            {mead.foodPairings.subtitle}
                                        </p>
                                        <ul className="space-y-3">
                                            {mead.foodPairings.pairings.map((pairing, pIndex) => (
                                                <li key={pIndex} className="flex items-start">
                                                    <span className="text-gold mr-3 mt-1">•</span>
                                                    <span className="text-white/80">{pairing}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            {index < siteContent.products.meads.length - 1 && (
                                <div className="mt-32 pt-16 border-t border-gold/10" />
                            )}
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
