'use client';

import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLocale();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.dir = dir();
    document.documentElement.lang = locale;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [locale, theme, dir]);

  return (
    <>
      <Toaster
        position={locale === 'ar' ? 'top-left' : 'top-right'}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#fff' : '#1f2937',
          },
        }}
      />
      {children}
    </>
  );
}
