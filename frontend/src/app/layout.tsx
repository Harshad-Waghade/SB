import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Footer } from '../components/Footer';
import { FirstOpenModal } from '../components/FirstOpenModal';
import { PwaInstallBanner } from '../components/PwaInstallBanner';

export const metadata: Metadata = {
  title: 'StayBite — Find Your Stay. Find Your Food.',
  description: 'Verified Rooms, PGs, Hostels, and Messes for Students & Working Professionals in India.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/icon-192.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#0D9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <FirstOpenModal />
            <PwaInstallBanner />
          </AuthProvider>
        </LanguageProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('StayBite ServiceWorker registered with scope:', registration.scope);
                    },
                    function(err) {
                      console.log('StayBite ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
