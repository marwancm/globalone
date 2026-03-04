'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import type { Product, Category, HeroSlide } from '@/types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { locale, t } = useLocale();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes, slidesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('categories').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_slides').select('*').eq('active', true).order('sort_order', { ascending: true }),
      ]);
      if (productsRes.data) {
        setFeaturedProducts(productsRes.data.slice(0, 4));
        setBestSellers(productsRes.data.slice(0, 4));
      }
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (slidesRes.data && slidesRes.data.length > 0) setHeroSlides(slidesRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
      setEmail('');
    }
  };

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[400px] md:h-[520px] overflow-hidden bg-gray-900">
        {heroSlides.length > 0 ? (
          <>
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={slide.image_url}
                  alt={locale === 'ar' ? slide.title_ar : slide.title_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 w-full">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 drop-shadow-lg">
                      {locale === 'ar' ? slide.title_ar : slide.title_en}
                    </h1>
                    <p className="text-base md:text-xl text-gray-200 mb-6 max-w-xl drop-shadow">
                      {locale === 'ar' ? slide.subtitle_ar : slide.subtitle_en}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={slide.link}>
                        <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white shadow-xl">
                          {t('shopNow')}
                        </Button>
                      </Link>
                      <Link href="/shop?category=all">
                        <Button size="lg" variant="outline" className="border-white/80 text-white hover:bg-white/10 backdrop-blur-sm">
                          {t('exploreCategories')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Dot Indicators */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 h-2.5 bg-primary-500'
                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Arrow Navigation */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </>
        ) : (
          /* Fallback hero if no slides */
          <div className="relative h-full bg-gradient-to-br from-gray-900 via-primary-700 to-primary-500 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">{t('heroTitle')}</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8">{t('heroSubtitle')}</p>
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl">{t('shopNow')}</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('categories')}
            </h2>
            <Link href="/shop" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {locale === 'ar' ? cat.name_ar : cat.name_en}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('featuredProducts')}
            </h2>
            <Link href="/shop" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('bestSellers')}
            </h2>
            <Link href="/shop" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t('newsletter')}
          </h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            {t('newsletterDesc')}
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="flex-1 px-5 py-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-white"
              required
            />
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              {t('subscribe')}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
