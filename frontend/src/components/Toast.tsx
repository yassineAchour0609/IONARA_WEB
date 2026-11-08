'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useShop();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-100',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-100',
    info: 'border-cyan-500/30 bg-slate-900/95 text-cyan-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${borders[toast.type]} shadow-black/60 max-w-md`}>
        {icons[toast.type]}
        <p className="text-xs font-semibold">{toast.message}</p>
      </div>
    </div>
  );
}
