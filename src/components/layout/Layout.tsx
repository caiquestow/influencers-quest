// src/components/layout/Layout.tsx
import { Navbar } from './Navbar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0A0F1C]">
      <Navbar />
      <main className="relative">{children}</main>
    </div>
  );
}