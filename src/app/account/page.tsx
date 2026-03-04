'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import type { Order, User as UserType } from '@/types';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();
  const currency = t('currency');

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [profile, setProfile] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData) {
        setProfile(userData);
        setName(userData.name || '');
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (ordersData) setOrders(ordersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from('users').update({ name }).eq('id', profile.id);
    if (error) toast.error(t('error'));
    else toast.success(t('success'));
    setSaving(false);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('myAccount')}</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-dark-card rounded-xl p-1 mb-8 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-dark-bg shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t('editProfile')}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-dark-bg shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t('myOrders')}
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('editProfile')}</h2>
          <div className="space-y-4 max-w-md">
            <Input label={t('name')} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={t('email')} value={profile?.email || ''} disabled />
            <Button onClick={handleSaveProfile} loading={saving}>{t('save')}</Button>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-dark-card rounded-2xl p-12 border border-gray-100 dark:border-dark-border text-center">
              <p className="text-gray-500 dark:text-gray-400">{t('noOrders')}</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('orderNumber')}: <span className="font-mono font-bold text-gray-900 dark:text-white">{order.id.slice(0, 8)}</span></p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {t(order.status as any)}
                    </span>
                    <span className="font-bold text-primary-500">{formatPrice(order.total_price, currency)}</span>
                  </div>
                </div>
                {order.order_items && (
                  <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.product ? (locale === 'ar' ? item.product.name_ar : item.product.name_en) : 'Product'} x{item.quantity}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity, currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
