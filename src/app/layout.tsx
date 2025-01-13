// src/app/layout.tsx
'use client';

import { AnalysisProvider } from '@/contexts/AnalysisContext';
import { Layout } from '@/components/layout/Layout';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0F1C] antialiased">
        <AnalysisProvider>
          <Layout>{children}</Layout>
        </AnalysisProvider>
      </body>
    </html>
  );
}