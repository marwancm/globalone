'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils/helpers';
import Skeleton from '@/components/ui/Skeleton';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { t } = useLocale();
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const currency = t('currency');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [products, orders, users] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ]);

      const totalRevenue = orders.data?.reduce((sum: number, o: any) => sum + (o.total_price || 0), 0) || 0;

      setStats({
        totalProducts: products.count || 0,
        totalOrders: orders.data?.length || 0,
        totalUsers: users.count || 0,
        totalRevenue,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { title: t('totalProducts'), value: stats.totalProducts, icon: '📦', color: 'bg-blue-500', link: '/dashboard/products' },
    { title: t('totalOrders'), value: stats.totalOrders, icon: '🛒', color: 'bg-green-500', link: '/dashboard/orders' },
    { title: t('totalUsers'), value: stats.totalUsers, icon: '👥', color: 'bg-purple-500', link: '/dashboard/users' },
    { title: t('totalRevenue'), value: formatPrice(stats.totalRevenue, currency), icon: '💰', color: 'bg-yellow-500', link: '/dashboard/orders' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.title} href={card.link}>
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                <span className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white text-sm font-bold`}>
                  →
                </span>
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/dashboard/products" className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors">
            <span className="text-2xl block mb-2">📦</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('manageProducts')}</span>
          </Link>
          <Link href="/dashboard/categories" className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors">
            <span className="text-2xl block mb-2">📂</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('manageCategories')}</span>
          </Link>
          <Link href="/dashboard/orders" className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors">
            <span className="text-2xl block mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('manageOrders')}</span>
          </Link>
          <Link href="/dashboard/users" className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors">
            <span className="text-2xl block mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('manageUsers')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
