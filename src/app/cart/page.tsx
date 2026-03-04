'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { locale, t } = useLocale();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const currency = t('currency');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('emptyCart')}</h2>
        <Link href="/shop">
          <Button variant="primary" size="lg">{t('continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('myCart')}</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          {t('clearCart')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const name = locale === 'ar' ? item.product.name_ar : item.product.name_en;
            const price = item.product.discount_price || item.product.price;
            return (
              <div
                key={item.product.id}
                className="bg-white dark:bg-dark-card rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-dark-border flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.product.image_url || '/placeholder.jpg'}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/shop/${item.product.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                        {name}
                      </Link>
                      <p className="text-primary-500 font-bold mt-1">{formatPrice(price, currency)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 dark:border-dark-border rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-s-xl transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-e-xl transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {t('total')}: {formatPrice(price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('subtotal')}</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {(locale === 'ar' ? item.product.name_ar : item.product.name_en).substring(0, 25)}... x{item.quantity}
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
            <Link href="/checkout">
              <Button fullWidth size="lg">{t('checkout')}</Button>
            </Link>
            <Link href="/shop" className="block text-center text-sm text-primary-500 hover:text-primary-600 mt-3 font-medium">
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
