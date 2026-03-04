'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils/helpers';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardOrdersPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();
  const currency = t('currency');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, user:users(name, email), order_items(*, product:products(name_ar, name_en))')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error(t('error'));
    else { toast.success(t('success')); fetchOrders(); }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('manageOrders')}</h1>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('orderNumber')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('customer')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('total')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('status')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('date')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900 dark:text-white">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{(order as any).user?.name || (order as any).user?.email || '-'}</td>
                  <td className="px-4 py-3 text-primary-500 font-bold">{formatPrice(order.total_price, currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
