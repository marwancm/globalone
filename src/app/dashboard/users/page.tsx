'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardUsersPage() {
  const { t } = useLocale();
  const supabase = createClient();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (userId: string, role: string) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', userId);
    if (error) toast.error(t('error'));
    else { toast.success(t('success')); fetchUsers(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) toast.error(t('error'));
    else { toast.success(t('success')); fetchUsers(); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('manageUsers')}</h1>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('name')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('email')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('role')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('date')}</th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
