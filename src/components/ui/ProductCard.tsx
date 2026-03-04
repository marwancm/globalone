'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getDiscountPercentage } from '@/utils/helpers';
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
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product);
    toast.success(locale === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-border">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image_url || '/placeholder.jpg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-3 start-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{getDiscountPercentage(product.price, product.discount_price!)}%
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{t('outOfStock')}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-primary-500">
                  {formatPrice(product.discount_price!, currency)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price, currency)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-500">
                {formatPrice(product.price, currency)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? t('addToCart') : t('outOfStock')}
          </button>
        </div>
      </div>
    </Link>
  );
}
