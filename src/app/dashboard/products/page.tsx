'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type { Product, Category } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardProductsPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();
  const currency = t('currency');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const emptyForm = { name_ar: '', name_en: '', description_ar: '', description_en: '', price: '', discount_price: '', stock: '', category_id: '', brand: '', image_url: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFiles([]); setExistingImages([]); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name_ar: p.name_ar, name_en: p.name_en, description_ar: p.description_ar || '', description_en: p.description_en || '',
      price: String(p.price), discount_price: String(p.discount_price || ''), stock: String(p.stock), category_id: p.category_id || '', brand: p.brand || '', image_url: p.image_url || '',
    });
    setImageFiles([]);
    setExistingImages(p.images || [p.image_url].filter(Boolean));
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    let images = [...existingImages];

    // Upload new images
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, file);
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
        images.push(urlData.publicUrl);
      }
    }

    const image_url = images[0] || form.image_url;

    const payload = {
      name_ar: form.name_ar, name_en: form.name_en, description_ar: form.description_ar, description_en: form.description_en,
      price: parseFloat(form.price) || 0, discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      stock: parseInt(form.stock) || 0, category_id: form.category_id || null, image_url, images,
    };

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    }

    setShowModal(false);
    fetchProducts();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(t('error'));
    else { toast.success(t('success')); fetchProducts(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('manageProducts')}</h1>
        <Button onClick={openAdd}>{t('addProduct')}</Button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('image')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('productName')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('price')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('stock')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{locale === 'ar' ? p.name_ar : p.name_en}</td>
                  <td className="px-4 py-3 text-primary-500 font-bold">{formatPrice(p.price, currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-600 text-xs font-medium">{t('edit')}</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">{t('delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? t('editProduct') : t('addProduct')} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('productName')} (AR)</label>
              <input name="name_ar" value={form.name_ar} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('productName')} (EN)</label>
              <input name="name_en" value={form.name_en} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')} (AR)</label>
            <textarea name="description_ar" value={form.description_ar} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')} (EN)</label>
            <textarea name="description_en" value={form.description_en} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('price')}</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('discount')}</label>
              <input name="discount_price" type="number" step="0.01" value={form.discount_price} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('stock')}</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category')}</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">--</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{locale === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{locale === 'ar' ? 'العلامة التجارية' : 'Brand'}</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder={locale === 'ar' ? 'مثال: Samsung, Apple, LG' : 'e.g. Samsung, Apple, LG'} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{locale === 'ar' ? 'صور المنتج' : 'Product Images'}</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="text-sm mb-2" />
            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imageFiles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{imageFiles.length} {locale === 'ar' ? 'صور جديدة محددة' : 'new images selected'}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>{t('cancel')}</Button>
            <Button onClick={handleSave} loading={saving}>{t('save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
