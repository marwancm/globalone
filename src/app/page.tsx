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
                  className="w-full h-full object-cover md:object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%23667eea" width="1200" height="600"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="48" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EHero Image%3C/text%3E%3C/svg%3E';
                  }}
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

      {/* Promotional Banner */}
      <section className="py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-center">
            <span className="text-xl md:text-2xl font-black">
              {locale === 'ar' ? '🎉 عروض رمضان - خصومات تصل إلى 50%' : '🎉 Ramadan Offers - Up to 50% OFF'}
            </span>
          </div>
        </div>
      </section>

      {/* Category Deals */}
      <section className="py-12 bg-gray-50 dark:bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name_ar: 'الثلاجات', name_en: 'Refrigerators', discount: '25%', gradient: 'from-blue-500 to-blue-600' },
              { name_ar: 'الغسالات', name_en: 'Washing Machines', discount: '30%', gradient: 'from-purple-500 to-purple-600' },
              { name_ar: 'التلفزيونات', name_en: 'TVs & Audio', discount: '20%', gradient: 'from-pink-500 to-pink-600' },
              { name_ar: 'اللابتوبات', name_en: 'Laptops', discount: '15%', gradient: 'from-indigo-500 to-indigo-600' },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="/shop"
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${item.gradient} p-6 md:p-8 text-white h-32 md:h-40 flex flex-col items-center justify-center text-center`}>
                  <div className="text-4xl md:text-5xl font-black mb-1">{item.discount}</div>
                  <div className="text-xs md:text-sm font-bold uppercase tracking-wide opacity-90">
                    {locale === 'ar' ? 'خصم' : 'Discount'}
                  </div>
                  <div className="text-xs md:text-sm font-semibold mt-2">
                    {locale === 'ar' ? item.name_ar : item.name_en}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('categories')}
            </h2>
            <Link href="/shop" className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1 group">
              {t('viewAll')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group bg-white dark:bg-dark-card border-2 border-gray-100 dark:border-dark-border rounded-2xl p-5 text-center hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/40 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {locale === 'ar' ? cat.name_ar : cat.name_en}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
              {t('featuredProducts')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {locale === 'ar' ? 'اكتشف أحدث المنتجات المميزة بأفضل الأسعار' : 'Discover our latest featured products at the best prices'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop">
              <button className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('viewAll')} →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold mb-3">
              🔥 {locale === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
              {t('bestSellers')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {locale === 'ar' ? 'المنتجات الأكثر طلباً من عملائنا' : 'Most popular products from our customers'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-white dark:bg-dark-bg border-y border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-8">
            {locale === 'ar' ? 'العلامات التجارية الموثوقة' : 'Trusted Brands'}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
            {[
              { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/200px-LG_logo_%282015%29.svg.png' },
              { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png' },
              { name: 'Bosch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logotype.svg/200px-Bosch-logotype.svg.png' },
              { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/200px-Sony_logo.svg.png' },
              { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png' },
              { name: 'Philips', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Philips_logo_new.svg/200px-Philips_logo_new.svg.png' },
            ].map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${brand.name}`}
                className="group flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 md:h-10 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const text = document.createElement('div');
                      text.className = 'text-xl md:text-2xl font-black text-gray-400 dark:text-gray-600 group-hover:text-primary-500 transition-colors';
                      text.textContent = brand.name;
                      parent.appendChild(text);
                    }
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('newsletter')}
          </h2>
          <p className="text-primary-50 text-lg mb-10 max-w-2xl mx-auto">
            {t('newsletterDesc')}
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-base"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
