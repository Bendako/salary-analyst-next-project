"use client"

import React, { useState } from 'react';
import { Github, Languages, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type Language = 'en' | 'he';

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface Translation {
  title: string;
  subtitle: string;
  description: string;
  viewOnGithub: string;
  comingSoon: string;
  getStarted: string;
  features: Feature[];
  benefits: string[];
}

interface Translations {
  en: Translation;
  he: Translation;
}

interface FeatureCardProps {
  title: string;
  description: string;
  isRTL: boolean;
  icon?: React.ReactNode;
  index: number;
}

const translations: Translations = {
  en: {
    title: "Income Source Analytics",
    subtitle: "Track. Analyze. Grow.",
    description: "A comprehensive platform for tracking, managing, and analyzing multiple sources of income. Get detailed insights, track performance, and make data-driven financial decisions.",
    viewOnGithub: "View on GitHub",
    comingSoon: "Coming Soon",
    getStarted: "Get Started",
    benefits: [
      "Real-time income tracking",
      "Smart financial insights",
      "Automated reporting",
      "Secure data encryption"
    ],
    features: [
      {
        title: "Income Dashboard",
        description: "Track all your income sources in one place with real-time updates and visual breakdowns."
      },
      {
        title: "Performance Analytics",
        description: "Analyze trends, compare income sources, and identify your most profitable revenue streams."
      },
      {
        title: "Smart Categorization",
        description: "Automatically categorize and organize income sources with intelligent tagging systems."
      },
      {
        title: "Financial Insights",
        description: "Generate comprehensive reports and forecast future earnings with AI-powered insights."
      }
    ]
  },
  he: {
    title: "ניתוח מקורות הכנסה",
    subtitle: "עקוב. נתח. צמח.",
    description: "פלטפורמה מקיפה למעקב, ניהול וניתוח מקורות הכנסה מרובים. קבל תובנות מפורטות, עקוב אחר ביצועים וקבל החלטות פיננסיות.",
    viewOnGithub: "צפה ב-GitHub",
    comingSoon: "בקרוב",
    getStarted: "התחל עכשיו",
    benefits: [
      "מעקב הכנסות בזמן אמת",
      "תובנות פיננסיות חכמות",
      "דיווח אוטומטי",
      "הצפנת נתונים מאובטחת"
    ],
    features: [
      {
        title: "לוח מחוונים של הכנסות",
        description: "עקוב אחר כל מקורות ההכנסה שלך במקום אחד עם עדכונים בזמן אמת."
      },
      {
        title: "ניתוח ביצועים",
        description: "נתח מגמות, השווה מקורות הכנסה וזהה את זרמי ההכנסה הרווחיים ביותר."
      },
      {
        title: "קטגוריזציה חכמה",
        description: "מיין וארגן אוטומטית מקורות הכנסה עם מערכות תיוג חכמות."
      },
      {
        title: "תובנות פיננסיות",
        description: "הפק דוחות מקיפים וחזה רווחים עתידיים עם תובנות מבוססות בינה מלאכותית."
      }
    ]
  }
};

const LoadingSpinner = () => (
  <div className="flex justify-center" role="status" aria-label="Loading">
    <motion.div 
      className="rounded-full h-12 w-12 border-b-2 border-primary"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const FeatureCard = ({ title, description, isRTL, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-lg border border-border bg-card hover:border-primary transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const BenefitItem = ({ text, isRTL, index }: { text: string; isRTL: boolean; index: number }) => (
  <motion.li
    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
  >
    <CheckCircle className="h-5 w-5 text-primary" />
    <span>{text}</span>
  </motion.li>
);

const PlaceholderPage = () => {
  const [language, setLanguage] = useState<Language>('he');
  const isRTL = language === 'he';
  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`}
    >
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLanguageToggle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'Hebrew' : 'English'}`}
          >
            <Languages className="h-5 w-5" />
            <span>{language === 'en' ? 'עברית' : 'English'}</span>
          </motion.button>
        </div>

        <div className="text-center mb-16 space-y-6">
          <LoadingSpinner />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mt-8">
              {t.title}
            </h1>
            <p className="text-xl font-semibold text-primary mt-4">
              {t.subtitle}
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
              {t.description}
            </p>
          </motion.div>

          <motion.div 
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/yourusername/project-name"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              tabIndex={0}
              aria-label={t.viewOnGithub}
            >
              <Github className="h-5 w-5" />
              <span>{t.viewOnGithub}</span>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <div className="mt-12">
            <ul className="space-y-3 max-w-md mx-auto">
              {t.benefits.map((benefit, index) => (
                <BenefitItem key={index} text={benefit} isRTL={isRTL} index={index} />
              ))}
            </ul>
          </div>

          <div className="relative mt-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                {t.comingSoon}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {t.features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              isRTL={isRTL}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default PlaceholderPage;