// app/layout.tsx
import { Inter } from 'next/font/google';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import "./globals.css";
import MainLayout from './components/MainLayout';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { ClerkUserSync } from '@/components/ClerkUserSync';
import { Toaster } from "sonner";

// Initialize Inter font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// Metadata configuration
export const metadata = {
  title: 'Project Management System',
  description: 'A comprehensive project management system built with Next.js',
};

// Authentication wrapper component for consistent styling
const AuthenticationWrapper = () => {
  return (
    <div className="absolute top-4 right-4 z-50">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8"
            }
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LanguageProvider>
                <ClerkUserSync />
                <Toaster />
                <MainLayout>
                  <AuthenticationWrapper />
                  {children}
                </MainLayout>
              </LanguageProvider>
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
  );
}