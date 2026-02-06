import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { OnboardingWrapper } from '@/components/onboarding';
import './globals.css';

// Optimized font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Charlie - Wealth Management Copilot',
    template: '%s | Charlie',
  },
  description: 'AI-powered portfolio analysis and wealth management copilot',
  keywords: ['portfolio', 'wealth management', 'AI', 'copilot', 'investment'],
  authors: [{ name: 'Charlie AI' }],
  creator: 'Charlie AI',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'Charlie - Wealth Management Copilot',
    description: 'AI-powered portfolio analysis and wealth management copilot',
    siteName: 'Charlie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charlie - Wealth Management Copilot',
    description: 'AI-powered portfolio analysis and wealth management copilot',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <TooltipProvider delayDuration={300}>
            <OnboardingWrapper />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
