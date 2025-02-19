"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { AuthModal } from './components/AuthModal';
import SearchParamsHandler from './components/SearchParamsHandler';
import { useSearchParams } from 'next/navigation';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: 'Real-time Tracking',
    description: 'Monitor your income sources with up-to-the-minute updates.',
    icon: <div className="h-8 w-8 text-blue-500">🕒</div>,
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Dive deep into your financial data with advanced charts and insights.',
    icon: <div className="h-8 w-8 text-green-500">📊</div>,
  },
  {
    title: 'Trend Prediction',
    description: 'Leverage AI-powered predictions for future income trends.',
    icon: <div className="h-8 w-8 text-purple-500">📈</div>,
  },
  {
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and protected.',
    icon: <div className="h-8 w-8 text-red-500">🔒</div>,
  },
];

const PlaceholderPage = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [attemptedRoute, setAttemptedRoute] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      setIsAuthModalOpen(true);
      setAttemptedRoute(event.detail.attemptedRoute);
    };

    // Use any to bypass TypeScript's event type checking
    const eventHandler = handleOpenAuthModal as EventListener;
    
    window.addEventListener('openAuthModal', eventHandler);

    // Check if there are any initial search params that should trigger the modal
    const authModal = searchParams.get('authModal');
    const route = searchParams.get('attemptedRoute');
    if (authModal === 'true') {
      setIsAuthModalOpen(true);
      setAttemptedRoute(route || undefined);
    }

    return () => {
      window.removeEventListener('openAuthModal', eventHandler);
    };
  }, [searchParams]);

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setAttemptedRoute(undefined);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.landingPageSubtitle}
          </p>
        </header>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature: Feature, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-card p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <Suspense fallback={null}>
          <SearchParamsHandler />
        </Suspense>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={handleCloseAuthModal}
          attemptedRoute={attemptedRoute}
        />
      </div>
    </motion.main>
  );
};

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PlaceholderPage />
    </Suspense>
  );
}