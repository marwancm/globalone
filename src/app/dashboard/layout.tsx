'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: '📊' },
  { key: 'manageProducts', href: '/dashboard/products', icon: '📦' },
  { key: 'manageCategories', href: '/dashboard/categories', icon: '📂' },
  { key: 'manageOrders', href: '/dashboard/orders', icon: '📋' },
  { key: 'manageUsers', href: '/dashboard/users', icon: '👥' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-3 space-y-1 sticky top-24">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  {t(item.key as any)}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
