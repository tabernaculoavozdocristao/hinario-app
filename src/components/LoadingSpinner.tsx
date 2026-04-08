import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 animate-fade-in">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
        <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-brand-amber animate-spin"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-5 font-medium">{message}</p>
    </div>
  );
}
