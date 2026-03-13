'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, getDiscountPercentage } from '@/utils/helpers';
import { getSupabaseImageUrl } from '@/utils/supabase';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
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
    toast.success(t('addToCart'));
  };

  const images = product?.images && product.images.length > 0 ? product.images : product?.image_url ? [product.image_url] : [];
  const totalImages = images.length;

  const nextImage = () => {
    if (totalImages > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (totalImages > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalImages]);

  const currency = t('currency');
  const name = product ? (locale === 'ar' ? product.name_ar : product.name_en) : '';
  const description = product ? (locale === 'ar' ? product.description_ar : product.description_en) : '';
  
  // Check if discount is active and not expired
  const now = new Date();
  const isDiscountActive = product?.discount_price && 
    product.discount_price < product.price &&
    (!product.discount_start_date || new Date(product.discount_start_date) <= now) &&
    (!product.discount_end_date || new Date(product.discount_end_date) >= now);
  
  const hasDiscount = isDiscountActive;

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
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative group">
            <div 
              className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={getSupabaseImageUrl(images[selectedImageIndex] || product.image_url)}
                alt={name}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>
            {hasDiscount && (
              <span className="absolute top-4 start-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                -{getDiscountPercentage(product.price, product.discount_price!)}%
              </span>
            )}
            {/* Navigation Arrows */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-card/90 hover:bg-white dark:hover:bg-dark-card text-gray-800 dark:text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-card/90 hover:bg-white dark:hover:bg-dark-card text-gray-800 dark:text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {totalImages}
                </div>
              </>
            )}
          </div>
          {/* Thumbnail Gallery */}
          {totalImages > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 dark:border-dark-border hover:border-primary-300'
                  }`}
                >
                  <img
                    src={getSupabaseImageUrl(img)}
                    alt={`${name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
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
