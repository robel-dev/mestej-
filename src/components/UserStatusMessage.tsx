'use client';

import { motion } from 'framer-motion';
import { content } from '@/lib/content';

interface UserStatusMessageProps {
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  locale: 'en' | 'sv';
}

export default function UserStatusMessage({ status, locale }: UserStatusMessageProps) {
  const siteContent = content[locale];

  const statusConfig = {
    pending: {
      icon: '⏳',
      title: siteContent.auth.status.pending,
      description: 'You will receive an email notification once your account has been approved.',
      bgColor: 'bg-gradient-to-br from-gold to-warm-gold',
      borderColor: 'border-gold/30',
      textColor: 'golden-text',
    },
    approved: {
      icon: '✅',
      title: siteContent.auth.status.approved,
      description: 'Your account is approved. You can now place orders.',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/50',
      textColor: 'text-green-400',
    },
    rejected: {
      icon: '🚫',
      title: siteContent.auth.status.rejected,
      description: 'Please contact support if you believe this is an error.',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-400',
    },
    blocked: {
      icon: '🚫',
      title: siteContent.auth.status.blocked,
      description: 'Please contact support if you believe this is an error.',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <h1 className={`text-3xl font-serif font-bold ${config.textColor} mb-4`}>
            {config.title}
          </h1>
          <p className="text-white/80">
            {config.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

