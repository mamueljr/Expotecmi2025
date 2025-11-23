import React from 'react';
import { ShieldCheck, LayoutGrid, Zap } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  onAdminClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, onAdminClick, title }) => {
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm"></div>
      <div className="relative max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button 
          onClick={onHomeClick}
          className="group flex items-center space-x-3 focus:outline-none"
        >
          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-2xl tracking-tighter text-slate-900 leading-none">
              EXPOTECMI
            </span>
            <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase mt-0.5">
              Evaluación 2025
            </span>
          </div>
        </button>

        <div className="flex items-center space-x-1 sm:space-x-2 bg-white/50 p-1.5 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm">
          <button 
            onClick={onHomeClick}
            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all duration-200"
            title="Inicio"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button 
            onClick={onAdminClick}
            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all duration-200"
            title="Administración"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};