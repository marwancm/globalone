'use client';

import React from 'react';
import { classNames } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={classNames(
          'w-full px-4 py-2.5 rounded-xl border transition-all duration-200',
          'bg-white dark:bg-dark-card text-gray-900 dark:text-white',
          'border-gray-300 dark:border-dark-border',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
