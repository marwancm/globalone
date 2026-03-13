'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { Brand } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardBrandsPage() {
  const { locale, t } = useLocale();
  const supabase = createClient();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    logo_url: '',
    sort_order: 0,
    active: true,
  });

  const fetchBrands = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Brands table not found. Please run the migration: supabase/add-brands-table.sql');
      setBrands([]);
    } else if (data) {
      setBrands(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `brands/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error(locale === 'ar' ? 'فشل رفع الشعار' : 'Logo upload failed');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
    toast.success(locale === 'ar' ? 'تم رفع الشعار' : 'Logo uploaded');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(locale === 'ar' ? 'حجم الشعار أكبر من 2MB' : 'Logo size exceeds 2MB');
        return;
      }
      uploadLogo(file);
    }
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({
      name_ar: '',
      name_en: '',
      logo_url: '',
      sort_order: brands.length,
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditing(brand);
    setForm({
      name_ar: brand.name_ar,
      name_en: brand.name_en,
      logo_url: brand.logo_url || '',
      sort_order: brand.sort_order,
      active: brand.active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en) {
      toast.error(locale === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setSaving(true);
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      logo_url: form.logo_url || null,
      sort_order: form.sort_order,
      active: form.active,
    };

    if (editing) {
      const { error } = await supabase.from('brands').update(payload).eq('id', editing.id);
      if (error) toast.error(locale === 'ar' ? 'حدث خطأ' : 'Error occurred');
      else toast.success(locale === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
    } else {
      const { error } = await supabase.from('brands').insert(payload);
      if (error) toast.error(locale === 'ar' ? 'حدث خطأ' : 'Error occurred');
      else toast.success(locale === 'ar' ? 'تمت الإضافة بنجاح' : 'Added successfully');
    }

    setShowModal(false);
    fetchBrands();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) toast.error(locale === 'ar' ? 'حدث خطأ' : 'Error occurred');
    else {
      toast.success(locale === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      fetchBrands();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {locale === 'ar' ? 'إدارة العلامات التجارية' : 'Manage Brands'}
        </h1>
        <Button onClick={openAddModal}>
          {locale === 'ar' ? 'إضافة علامة تجارية' : 'Add Brand'}
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'الشعار' : 'Logo'}
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'الاسم' : 'Name'}
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'الترتيب' : 'Order'}
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt={brand.name_en} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {brand.name_en.charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {locale === 'ar' ? brand.name_ar : brand.name_en}
                    </div>
                    <div className="text-xs text-gray-500">
                      {locale === 'ar' ? brand.name_en : brand.name_ar}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {brand.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        brand.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {brand.active
                        ? locale === 'ar' ? 'نشط' : 'Active'
                        : locale === 'ar' ? 'غير نشط' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                      >
                        {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="text-red-500 hover:text-red-600 text-xs font-medium"
                      >
                        {locale === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? (locale === 'ar' ? 'تعديل علامة تجارية' : 'Edit Brand') : (locale === 'ar' ? 'إضافة علامة تجارية' : 'Add Brand')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {locale === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}
            </label>
            <input
              name="name_ar"
              value={form.name_ar}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {locale === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}
            </label>
            <input
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {locale === 'ar' ? 'الترتيب' : 'Sort Order'}
            </label>
            <input
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'ar' ? 'الشعار' : 'Logo'}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm mb-2"
            />
            {form.logo_url && (
              <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                <img src={form.logo_url} alt="Logo preview" className="w-full h-full object-contain p-2" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {locale === 'ar' ? 'نشط' : 'Active'}
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} loading={saving || uploading}>
              {locale === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
