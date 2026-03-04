'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, getDiscountPercentage } from '@/utils/helpers';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { locale, t } = useLocale();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*, category:categories(*)').eq('id', id).single();
      if (data) {
        setProduct(data as Product);
        const { data: similar } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', data.id)
          .limit(4);
        if (similar) setSimilarProducts(similar);
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity);
    toast.success(locale === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const currency = t('currency');
  const name = product ? (locale === 'ar' ? product.name_ar : product.name_en) : '';
  const description = product ? (locale === 'ar' ? product.description_ar : product.description_en) : '';
  const hasDiscount = product?.discount_price && product.discount_price < product.price;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-500">{t('noProducts')}</p>
        <Link href="/shop" className="text-primary-500 mt-4 inline-block">{t('continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-500">{t('home')}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary-500">{t('shop')}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border">
            <img
              src={product.image_url || '/placeholder.jpg'}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          {hasDiscount && (
            <span className="absolute top-4 start-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              -{getDiscountPercentage(product.price, product.discount_price!)}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-primary-500">
                  {formatPrice(product.discount_price!, currency)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price, currency)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                  {t('discount')} {getDiscountPercentage(product.price, product.discount_price!)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary-500">
                {formatPrice(product.price, currency)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${t('stock')}: ${product.stock}` : t('outOfStock')}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('description')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 dark:border-dark-border rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-s-xl transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2.5 text-center font-semibold text-gray-900 dark:text-white min-w-[60px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2.5 text-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-e-xl transition-colors"
                >
                  +
                </button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                {t('addToCart')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('similarProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
