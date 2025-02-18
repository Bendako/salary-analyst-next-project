'use client'

import React from 'react';
import { Github, CheckCircle, Clock, PieChart, TrendingUp, Calendar, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Translation = {
  title: string;
  subtitle: string;
  description: string;
  viewOnGithub: string;
  comingSoon: string;
  getStarted: string;
  features: Feature[];
  benefits: string[];
};

type Translations = {
  en: Translation;
  he: Translation;
};

const translations: Translations = {
  en: {
    title: "Income Source Analytics",
    subtitle: "Track. Analyze. Optimize. Grow.",
    description: "Gain deep insights into your income streams with our advanced analytics platform.",
    viewOnGithub: "View on GitHub",
    comingSoon: "Coming Soon",
    getStarted: "Get Started",
    features: [
      {
        title: "Comprehensive Tracking",
        description: "Monitor all your income sources in one place.",
        icon: <PieChart className="h-6 w-6" />,
      },
      {
        title: "Advanced Analytics",
        description: "Dive deep into your financial data with powerful insights.",
        icon: <TrendingUp className="h-6 w-6" />,
      },
      {
        title: "Time Management",
        description: "Track income sources by time and optimize your earnings.",
        icon: <Clock className="h-6 w-6" />,
      },
    ],
    benefits: [
      "Real-time income tracking",
      "Detailed financial insights",
      "Personalized recommendations",
    ],
  },
  he: {
    title: "ניתוח מקורות הכנסה",
    subtitle: "מעקב. ניתוח. אופטימיזציה. צמיחה.",
    description: "קבל תובנות עמוקות על מקורות ההכנסה שלך עם פלטפורמת האנליטיקה המתקדמת שלנו.",
    viewOnGithub: "צפה ב-GitHub",
    comingSoon: "בקרוב",
    getStarted: "התחל עכשיו",
    features: [
      {
        title: "מעקב מקיף",
        description: "עקוב אחר כל מקורות ההכנסה שלך במקום אחד.",
        icon: <PieChart className="h-6 w-6" />,
      },
      {
        title: "אנליטיקה מתקדמת",
        description: "צלול לעומק נתוני הכספים שלך עם תובנות עוצמתיות.",
        icon: <TrendingUp className="h-6 w-6" />,
      },
      {
        title: "ניהול זמן",
        description: "עקוב אחר מקורות הכנסה לפי זמן ואופטימיזציה של ההכנסות שלך.",
        icon: <Clock className="h-6 w-6" />,
      },
    ],
    benefits: [
      "מעקב הכנסה בזמן אמת",
      "תובנות פיננסיות מפורטות",
      "המלצות מותאמות אישית",
    ],
  },
};

const FeatureCard = ({ title, description, icon, isRTL, index }: Feature & { isRTL: boolean; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    className={`bg-card text-card-foreground p-6 rounded-lg shadow-md flex flex-col items-start space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
  >
    <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const SecurityBadge = ({ isRTL }: { isRTL: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}
  >
    <Lock className="h-4 w-4" />
    <span>{isRTL ? 'אבטחה מתקדמת' : 'Advanced Security'}</span>
  </motion.div>
);

const PlaceholderPage = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`}
    >
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center space-x-4"
          >
            <Button variant="outline" size="lg" asChild>
              <a 
                href="https://github.com/Bendako/salary-analyst-next-project" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-2 h-4 w-4" />
                {t.viewOnGithub}
              </a>
            </Button>
          </motion.div>
        </div>

        <SecurityBadge isRTL={isRTL} />

        <section className="grid md:grid-cols-3 gap-6 mt-16">
          {t.features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              {...feature} 
              isRTL={isRTL} 
              index={index} 
            />
          ))}
        </section>
      </div>
    </motion.main>
  );
};

export default PlaceholderPage;