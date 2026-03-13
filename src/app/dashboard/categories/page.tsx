'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardCategoriesPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name_ar: '', name_en: '', image_url: '' });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name_ar: '', name_en: '', image_url: '' }); setImageFile(null); setShowModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name_ar: c.name_ar, name_en: c.name_en, image_url: c.image_url || '' }); setImageFile(null); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    let image_url = form.image_url;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `categories/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, imageFile);
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
    }

    const payload = { name_ar: form.name_ar, name_en: form.name_en, image_url };

    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    } else {
      const { error } = await supabase.from('categories').insert(payload);
      if (error) toast.error(t('error'));
      else toast.success(t('success'));
    }
    setShowModal(false);
    fetchCategories();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error(t('error'));
    else { toast.success(t('success')); fetchCategories(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('manageCategories')}</h1>
        <Button onClick={openAdd}>{t('addCategory')}</Button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('image')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('categoryName')} (AR)</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('categoryName')} (EN)</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name_en} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {locale === 'ar' ? 'لا توجد' : 'No image'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.name_ar}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.name_en}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-blue-500 hover:text-blue-600 text-xs font-medium">{t('edit')}</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">{t('delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? t('editCategory') : t('addCategory')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('categoryName')} (AR)</label>
            <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('categoryName')} (EN)</label>
            <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('image')}</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm mb-2" />
            {form.image_url && (
              <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
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
