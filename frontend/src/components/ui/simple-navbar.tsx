"use client";

import Link from "next/link";
import { useShop } from '@/context/ShopContext';
import {
  ShoppingCart,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { CurrencyCode } from '@/types';

/**
 * Simple, professional navigation bar
 * Focuses on clean branding and navigation
 */
export default function SimpleNavbar() {
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
    <nav className="border-b border-white/[0.04] bg-[#08090e]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/assets/logo/ionara-logo.svg"
                alt="IONARA"
                className="h-10 w-auto drop-shadow(0 0 6px rgba(216,104,209,0.4))"
              />
            </div>
            <div className="space-y-1 text-left">
              <p className="text-xs font-medium text-zinc-300 tracking-wider">
                25 ANS D'EXPERTISE
              </p>
              <p className="font-bold text-xl text-white tracking-tighter">
                IONARA
              </p>
            </div>
          </Link>

          {/* Center: Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/"
                  className={`text-zinc-300 hover:text-pink-400 transition-colors
                    border-b-2 border-transparent
                    `}>
              Accueil
            </Link>
            <Link href="/catalogue"
                  className={`text-zinc-300 hover:text-pink-400 transition-colors
                    border-b-2 border-transparent
                    `}>
              Catalogue
            </Link>
            <Link href="/services"
                  className={`text-zinc-300 hover:text-pink-400 transition-colors
                    border-b-2 border-transparent
                    `}>
              Services
            </Link>
            <Link href="/a-propos"
                  className={`text-zinc-300 hover:text-pink-400 transition-colors
                    border-b-2 border-transparent
                    `}>
              À Propos
            </Link>
            <Link href="/contact"
                  className={`text-zinc-300 hover:text-pink-400 transition-colors
                    border-b-2 border-transparent
                    `}>
              Contact
            </Link>
          </nav>

          {/* Right: User Controls & Actions */}
          <div className="flex items-center gap-3">

            {/* Mini Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.05]
                        transition-transform duration-200"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5 text-zinc-300 hover:text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                              rounded-full bg-pink-500 text-xs font-bold text-white
                              ring-2 ring-[#08090e]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* User / Auth */}
            {user ? (
              <>
                <button
                  onClick={() => { logoutUser(); }}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.05]
                            text-zinc-300 hover:text-white transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={openAuth}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.06]
                        text-xs font-medium text-zinc-200 hover:text-white
                        transition-colors border border-white/[0.1]"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}