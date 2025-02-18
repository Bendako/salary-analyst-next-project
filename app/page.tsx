'use client'

import React, { useState } from 'react';
import { Github, Languages, ArrowRight, CheckCircle, Clock, PieChart, TrendingUp, Calendar, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

type Language = 'en' | 'he';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
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

const translations: Translations = {
  en: {
    title: "Income Source Analytics",
    subtitle: "Track. Analyze. Optimize. Grow.",
    description: "A comprehensive platform for tracking, managing, and analyzing multiple sources of income. Get detailed insights, track working hours, and make data-driven financial decisions with our advanced analytics tools.",
    viewOnGithub: "View on GitHub",
    comingSoon: "Coming Soon",
    getStarted: "Get Started",
    benefits: [
      "Detailed income source tracking and categorization",
      "Intelligent time tracking and management",
      "Customizable reporting and analytics",
      "Secure data encryption",
      "Multi-currency calculations",
      "Historical trend analysis"
    ],
    features: [
      {
        title: "Comprehensive Dashboard",
        description: "Track all income sources with real-time updates, visual breakdowns, and customizable widgets.",
        icon: <PieChart className="h-6 w-6 text-primary" />
      },
      {
        title: "Time Tracking",
        description: "Built-in time tracking for hourly work, with automatic rate calculations and overtime monitoring.",
        icon: <Clock className="h-6 w-6 text-primary" />
      },
      {
        title: "Advanced Analytics",
        description: "AI-powered analysis of income patterns, productivity metrics, and earning potential forecasts.",
        icon: <TrendingUp className="h-6 w-6 text-primary" />
      },
      {
        title: "Schedule Management",
        description: "Integrated calendar for managing work schedules, deadlines, and payment dates across income sources.",
        icon: <Calendar className="h-6 w-6 text-primary" />
      }
    ]
  },
  he: {
    title: "ניתוח מקורות הכנסה",
    subtitle: "עקוב. נתח. שפר. צמח.",
    description: "פלטפורמה מקיפה למעקב, ניהול וניתוח מקורות הכנסה מרובים. קבל תובנות מפורטות, עקוב אחר שעות עבודה וקבל החלטות פיננסיות מבוססות נתונים עם כלי הניתוח המתקדמים שלנו.",
    viewOnGithub: "צפה ב-GitHub",
    comingSoon: "בקרוב",
    getStarted: "התחל עכשיו",
    benefits: [
      "מעקב וקטגוריזציה מפורטים של מקורות הכנסה",
      "ניהול ומעקב זמן חכם",
      "דוחות וניתוחים מותאמים אישית",
      "הצפנת נתונים מאובטחת",
      "חישובי מטבעות מרובים",
      "ניתוח מגמות היסטורי"
    ],
    features: [
      {
        title: "לוח מחוונים מקיף",
        description: "מעקב אחר כל מקורות ההכנסה עם עדכונים בזמן אמת, ניתוחים חזותיים ווידג'טים מותאמים אישית.",
        icon: <PieChart className="h-6 w-6 text-primary" />
      },
      {
        title: "מעקב זמן",
        description: "מעקב זמן מובנה לעבודה לפי שעות, עם חישובי תעריפים אוטומטיים וניטור שעות נוספות.",
        icon: <Clock className="h-6 w-6 text-primary" />
      },
      {
        title: "ניתוח מתקדם",
        description: "ניתוח מבוסס בינה מלאכותית של דפוסי הכנסה, מדדי פרודוקטיביות ותחזיות פוטנציאל הרווחה.",
        icon: <TrendingUp className="h-6 w-6 text-primary" />
      },
      {
        title: "ניהול לוח זמנים",
        description: "לוח שנה משולב לניהול לוחות זמנים של עבודה, מועדי סיום ותאריכי תשלום במקורות הכנסה.",
        icon: <Calendar className="h-6 w-6 text-primary" />
      }
    ]
  }
};

const FeatureCard = ({ title, description, icon, isRTL, index }: Feature & { isRTL: boolean; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-lg border border-border bg-card hover:border-primary transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
  >
    <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const SecurityBadge = ({ isRTL }: { isRTL: boolean }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex items-center gap-2 justify-center mt-8 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
  >
    <Lock className="h-4 w-4" />
    <span>{isRTL ? 'אבטחה מתקדמת' : 'Advanced Security'}</span>
  </motion.div>
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
        <motion.div 
          className="flex justify-end mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleLanguageToggle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'Hebrew' : 'English'}`}
          >
            <Languages className="h-5 w-5" />
            <span>{language === 'en' ? 'עברית' : 'English'}</span>
          </button>
        </motion.div>

        <div className="text-center mb-16 space-y-6">
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-6">
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
              href="https://github.com/Bendako/salary-analyst-next-project"
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
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <SecurityBadge isRTL={isRTL} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {t.features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
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