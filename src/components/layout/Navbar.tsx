// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Leaderboard', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Monetization', href: '/monetization' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/research' }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0A0F1C]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold text-white">
                VerifyInfluencers
              </span>
            </Link>

            <nav className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}