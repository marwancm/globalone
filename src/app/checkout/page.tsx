'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { t, locale } = useLocale();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const currency = t('currency');

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({ fullName: '', address: '', city: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_price: totalPrice(),
        status: 'pending',
      })
      .select()
      .single();

    if (error || !order) {
      toast.error(t('error'));
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.discount_price || item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      toast.error(t('error'));
      setLoading(false);
      return;
    }

    clearCart();
    setOrderId(order.id);
    setOrderPlaced(true);
    toast.success(t('orderSuccess'));
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('orderSuccess')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{t('orderNumber')}: <span className="font-mono font-bold">{orderId.slice(0, 8)}</span></p>
        <Button onClick={() => router.push('/account')} className="mt-4">{t('myOrders')}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('checkout')}</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('shippingInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('fullName')} name="fullName" value={form.fullName} onChange={handleChange} required />
                <Input label={t('phone')} name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                <div className="md:col-span-2">
                  <Input label={t('address')} name="address" value={form.address} onChange={handleChange} required />
                </div>
                <Input label={t('city')} name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('paymentMethod')}</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-dark-border hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('cashOnDelivery')}</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-dark-border hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('creditCard')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('subtotal')}</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {(locale === 'ar' ? item.product.name_ar : item.product.name_en).substring(0, 20)}... x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice((item.product.discount_price || item.product.price) * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-dark-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{t('total')}</span>
                  <span className="text-lg font-bold text-primary-500">{formatPrice(totalPrice(), currency)}</span>
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" loading={loading}>
                {t('placeOrder')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
