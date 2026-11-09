"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  Gamepad2,
  Flame,
  ShieldCheck,
  Star,
  LogOut,
  Coins
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CurrencyCode } from '@/types';

/**
 * Main header component - clean and professional
 * Displays logo/title, navigation, and user controls
 */
export default function ProfessionalHeader({
  title,
  onSearchChange,
  className = ""
}: {
  title: string;
  onSearchChange?: (val: string) => void;
  className?: string;
}) {
  const {
    currency,
    setCurrency,
    cartCount,
    openCart,
    user,
    logoutUser,
    openAuth
  } = useShop();

  return (
    <header className={`border-b border-white/[0.08] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 p-1 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/logo/ionara-logo.svg"
                alt="IONARA"
                className="w-full h-full object-contain filter drop-shadow(0 0 8px rgba(216,104,209,0.5))"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white font-headline group-hover:text-pink-300 transition">
                  IONARA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-widest">
                  25 ANS D'EXPÉRIENCE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Comptes Gaming & Services Professionnels
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-zinc-300">
            <Link href="#featured" className="hover:text-pink-400 transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              En Vedette
            </Link>
            <Link href="#catalog" className="hover:text-pink-400 transition flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              Catalogue
            </Link>
            <Link href="#services" className="hover:text-pink-400 transition flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Services
            </Link>
            <Link href="#about" className="hover:text-pink-400 transition flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              À Propos
            </Link>
            <Link href="#contact" className="hover:text-pink-400 transition flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-yellow-400" />
              Contact
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 w-[200px] md:w-[250px]"
              />
            </div>

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-white/[0.05] border border-white/10 hover:border-pink-500/40 text-xs font-bold text-zinc-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none transition"
              >
                <option value="DZD" className="bg-slate-900 text-white">🇩🇿 DZD</option>
                <option value="EUR" className="bg-slate-900 text-white">🇪🇺 EUR</option>
                <option value="USD" className="bg-slate-900 text-white">🇺🇸 USD</option>
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-400 hover:text-pink-300 transition cursor-pointer shadow-lg shadow-pink-500/10"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold flex items-center justify-center border border-[#08090e] shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300 flex items-center gap-2">
                  <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={logoutUser}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 transition"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-pink-500/30 text-xs font-bold text-white transition cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-pink-400" />
                <span>Connexion</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => { /* Mobile menu handled by layout or state */ }}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}