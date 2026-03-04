'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, TranslationKey } from '@/lib/i18n/translations';
import type { Locale } from '@/types';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: () => 'rtl' | 'ltr';
}

export const useLocale = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: TranslationKey) => {
        const { locale } = get();
        return translations[locale][key] || key;
      },
      dir: () => (get().locale === 'ar' ? 'rtl' : 'ltr'),
    }),
    { name: 'globalone-locale' }
  )
);
