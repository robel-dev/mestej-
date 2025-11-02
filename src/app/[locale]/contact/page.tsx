'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { content } from '@/lib/content';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    params.then(({ locale }) => {
      const validLocale = (locale === 'sv') ? 'sv' : 'en';
      setLanguage(validLocale);
    });
  }, [params]);

  const siteContent = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            <span className="golden-text">{siteContent.contact.title}</span>
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with questions, feedback, or just to say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold golden-text mb-6">
                Send us a Message
              </h2>
              
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 mb-6"
                >
                  {submitMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    {siteContent.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg glass border border-gold/30 bg-black/50 text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    {siteContent.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg glass border border-gold/30 bg-black/50 text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    {siteContent.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg glass border border-gold/30 bg-black/50 text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-warm-gold text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                      />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    siteContent.contact.form.submit
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold golden-text mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-white/70">info@mestej.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Location</h3>
                    <p className="text-white/70">Sweden</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold to-warm-gold flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                    <p className="text-white/70">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-white/70">Sat - Sun: By appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 rounded-2xl glass border border-gold/30 bg-gradient-to-br from-gold/10 to-warm-gold/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-white/60">Interactive map coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
