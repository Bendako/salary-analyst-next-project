// app/providers/ThemeProvider.tsx
"use client";

import React from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define the Attribute type to match next-themes expectations
type Attribute = 'class' | 'data-theme' | `data-${string}`;

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  themes?: string[];
  forcedTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({ 
  children,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // This is now properly typed
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}