'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success(t('resetEmailSent'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-dark-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('resetPassword')}</h1>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('resetEmailSent')}</p>
              <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                {t('login')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
              <Button type="submit" fullWidth loading={loading}>
                {t('sendResetLink')}
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                  {t('back')} → {t('login')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
