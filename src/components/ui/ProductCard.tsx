'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getDiscountPercentage } from '@/utils/helpers';
import { getSupabaseImageUrl } from '@/utils/supabase';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
  const { addItem } = useCart();
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const currency = t('currency');
  
  // Check if discount is active and not expired
  const now = new Date();
  const isDiscountActive = product.discount_price && 
    product.discount_price < product.price &&
    (!product.discount_start_date || new Date(product.discount_start_date) <= now) &&
    (!product.discount_end_date || new Date(product.discount_end_date) >= now);
  
  const hasDiscount = isDiscountActive;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product);
    toast.success(locale === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const imageUrl = product.images && product.images.length > 0 
    ? getSupabaseImageUrl(product.images[0]) 
    : product.image_url 
    ? getSupabaseImageUrl(product.image_url)
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-dark-border hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {hasDiscount && (
            <div className="absolute top-0 start-0 z-10">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-br-2xl shadow-lg">
                  <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wide opacity-90">{locale === 'ar' ? 'خصم' : 'Sale'}</div>
                  <div className="text-lg sm:text-2xl font-black leading-none">-{getDiscountPercentage(product.price, product.discount_price!)}%</div>
                </div>
              </div>
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 px-6 py-3 rounded-xl">
                <span className="text-gray-900 dark:text-white font-bold text-base">{t('outOfStock')}</span>
              </div>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-3 start-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {locale === 'ar' ? `متبقي ${product.stock} فقط` : `Only ${product.stock} left`}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {name}
          </h3>
          <div className="flex items-baseline gap-2.5 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                  {formatPrice(product.discount_price!, currency)}
                </span>
                <span className="text-base text-gray-400 line-through font-medium">
                  {formatPrice(product.price, currency)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                {formatPrice(product.price, currency)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.stock > 0 ? t('addToCart') : t('outOfStock')}
          </button>
        </div>
      </div>
    </Link>
  );
}
