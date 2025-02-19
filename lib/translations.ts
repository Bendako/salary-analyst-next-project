type Translation = {
  title: string;
  landingPageSubtitle: string;
  description: string;
  viewOnGithub: string;
  comingSoon: string;
  getStarted: string;
};

export const translations: Record<string, Translation> = {
  en: {
    title: "Income Source Analytics",
    landingPageSubtitle: "Track. Analyze. Optimize. Grow.",
    description: "Gain deep insights into your income streams with our advanced analytics platform.",
    viewOnGithub: "View on GitHub",
    comingSoon: "Coming Soon",
    getStarted: "Get Started",
  },
  he: {
    title: "ניתוח מקורות הכנסה",
    landingPageSubtitle: "מעקב. ניתוח. אופטימיזציה. צמיחה.",
    description: "קבל תובנות עמוקות על מקורות ההכנסה שלך עם פלטפורמת האנליטיקה המתקדמת שלנו.",
    viewOnGithub: "צפה ב-GitHub",
    comingSoon: "בקרוב",
    getStarted: "התחל עכשיו",
  }
};
