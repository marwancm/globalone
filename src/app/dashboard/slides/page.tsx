'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type { HeroSlide } from '@/types';
import toast from 'react-hot-toast';

export default function SlidesPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState({
    title_ar: '',
    title_en: '',
    subtitle_ar: '',
    subtitle_en: '',
    image_url: '',
    link: '/shop',
    sort_order: 0,
    active: true,
  });

  const fetchSlides = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setSlides(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setForm({ title_ar: '', title_en: '', subtitle_ar: '', subtitle_en: '', image_url: '', link: '/shop', sort_order: slides.length, active: true });
    setModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setForm({
      title_ar: slide.title_ar,
      title_en: slide.title_en,
      subtitle_ar: slide.subtitle_ar,
      subtitle_en: slide.subtitle_en,
      image_url: slide.image_url,
      link: slide.link,
      sort_order: slide.sort_order,
      active: slide.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast.error(locale === 'ar' ? 'رابط الصورة مطلوب' : 'Image URL is required');
      return;
    }
    setSaving(true);
    if (editingSlide) {
      const { error } = await supabase
        .from('hero_slides')
        .update(form)
        .eq('id', editingSlide.id);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    } else {
      const { error } = await supabase
        .from('hero_slides')
        .insert(form);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    }
    setSaving(false);
    setModalOpen(false);
    fetchSlides();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) toast.error(t('error'));
    else {
      toast.success(t('success'));
      fetchSlides();
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    await supabase
      .from('hero_slides')
      .update({ active: !slide.active })
      .eq('id', slide.id);
    fetchSlides();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {locale === 'ar' ? 'صور الهيرو' : 'Hero Slides'}
        </h1>
        <Button onClick={openAddModal}>
          {locale === 'ar' ? '+ إضافة صورة' : '+ Add Slide'}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-dark-card animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl p-12 border border-gray-100 dark:border-dark-border text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {locale === 'ar' ? 'لا توجد صور. أضف صورة جديدة.' : 'No slides. Add a new slide.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
              <div className="relative h-40">
                <img src={slide.image_url} alt={locale === 'ar' ? slide.title_ar : slide.title_en} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 start-3 text-white">
                  <h3 className="font-bold text-sm">{locale === 'ar' ? slide.title_ar : slide.title_en}</h3>
                  <p className="text-xs text-gray-300">{locale === 'ar' ? slide.subtitle_ar : slide.subtitle_en}</p>
                </div>
                <div className="absolute top-3 end-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${slide.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {slide.active ? (locale === 'ar' ? 'مفعّل' : 'Active') : (locale === 'ar' ? 'معطّل' : 'Inactive')}
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center gap-2">
                <Button size="sm" onClick={() => openEditModal(slide)}>
                  {t('edit')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(slide)}>
                  {slide.active ? (locale === 'ar' ? 'تعطيل' : 'Disable') : (locale === 'ar' ? 'تفعيل' : 'Enable')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(slide.id)} className="text-red-500 border-red-200 hover:bg-red-50">
                  {t('delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSlide ? (locale === 'ar' ? 'تعديل الصورة' : 'Edit Slide') : (locale === 'ar' ? 'إضافة صورة' : 'Add Slide')}>
        <div className="space-y-4">
          <Input
            label={locale === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
            value={form.title_ar}
            onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
          />
          <Input
            label={locale === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
            value={form.title_en}
            onChange={(e) => setForm({ ...form, title_en: e.target.value })}
          />
          <Input
            label={locale === 'ar' ? 'الوصف (عربي)' : 'Subtitle (Arabic)'}
            value={form.subtitle_ar}
            onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })}
          />
          <Input
            label={locale === 'ar' ? 'الوصف (إنجليزي)' : 'Subtitle (English)'}
            value={form.subtitle_en}
            onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })}
          />
          <Input
            label={locale === 'ar' ? 'رابط الصورة' : 'Image URL'}
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            required
          />
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded-xl border" />
          )}
          <Input
            label={locale === 'ar' ? 'رابط الزر' : 'Button Link'}
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <Input
            label={locale === 'ar' ? 'الترتيب' : 'Sort Order'}
            type="number"
            value={form.sort_order.toString()}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 text-primary-500 rounded"
            />
            <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
              {locale === 'ar' ? 'مفعّل' : 'Active'}
            </label>
          </div>
          <Button onClick={handleSave} loading={saving} fullWidth>
            {t('save')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
