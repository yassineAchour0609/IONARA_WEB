'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
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
  ChevronDown,
  Bell,
  Coins
} from 'lucide-react';
import { CurrencyCode } from '@/types';

export default function Navbar({ onSearchChange }: { onSearchChange?: (val: string) => void }) {
  const { 
    currency, 
    setCurrency, 
    cartCount, 
    openCart, 
    user, 
    logoutUser, 
    openAuth 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <>

      {/* Floating Capsule Island Navbar */}
      <header className="sticky top-3 sm:top-4 z-40 w-full px-2 sm:px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          
          <div className="relative bg-[#090b12]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-pink-500/40 rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-300">
            
            {/* Left: Grand Visible Logo Brand Typographique & Dropdown */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-0.5" title="IONARA - Boutique Officielle">
                <div className="relative flex items-center">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/25 to-pink-500/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-300 pointer-events-none" />
                  <img 
                    src="/assets/logo/ionara-wordmark.png" 
                    alt="IONARA" 
                    className="relative h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow(0 0 16px rgba(216,104,209,0.55)) group-hover:drop-shadow(0 0 24px rgba(216,104,209,0.9)) group-hover:scale-[1.04] transition-all duration-300"
                  />
                </div>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[9px] font-black rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-300 border border-pink-500/35 uppercase tracking-widest shadow-sm">
                  STORE
                </span>
              </Link>

              {/* Navigation Links Multi-Pages */}
              <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
                <Link href="/" className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/15 transition">
                  Accueil
                </Link>

                <Link href="/catalogue" className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-pink-500/15 text-zinc-300 hover:text-pink-300 border border-white/10 hover:border-pink-500/40 text-xs font-bold flex items-center gap-1.5 transition">
                  <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Catalogue</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-pink-500/30 text-pink-200 text-[9px] font-extrabold uppercase">25+</span>
                </Link>

                {/* Shop ⌵ Dropdown */}
                <div className="relative group/shop">
                  <button 
                    onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/40 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Rayons</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400 group-hover/shop:rotate-180 transition-transform duration-300" />
                  </button>

                  <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-slate-950/95 border border-pink-500/30 backdrop-blur-2xl p-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/shop:opacity-100 group-hover/shop:translate-y-0 group-hover/shop:pointer-events-auto transition-all duration-300 z-50">
                    <Link href="/catalogue?category=steam" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-pink-500/15 transition">
                      <Flame className="w-4 h-4 text-pink-400" />
                      <div>
                        <p className="font-bold">Pack Steam 1,170+ Jeux</p>
                        <p className="text-[10px] text-zinc-400">Bibliothèque complète à vie</p>
                      </div>
                    </Link>
                    <Link href="/catalogue?category=preorder" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] transition">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="font-bold">Précommandes VIP</p>
                        <p className="text-[10px] text-zinc-400">GTA VI, EA FC 27, COD BO7</p>
                      </div>
                    </Link>
                    <Link href="/catalogue?category=passes" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] transition">
                      <Gamepad2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-bold">Xbox Game Pass Ultimate</p>
                        <p className="text-[10px] text-zinc-400">12 mois PC & Xbox</p>
                      </div>
                    </Link>
                    <Link href="/catalogue?category=currencies" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] transition">
                      <Coins className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="font-bold">Points & Monnaies</p>
                        <p className="text-[10px] text-zinc-400">Valorant VP & Robux</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Pack 1000+ Pill Link */}
                <Link href="/catalogue?category=steam" className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold transition">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  <span>Pack 1,000+</span>
                </Link>
              </nav>
            </div>

            {/* Center: Integrated Search Bar (Arcetis Style) */}
            <div className="flex-1 max-w-xl mx-2 hidden md:block relative group/search">
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 text-zinc-400 group-focus-within/search:text-pink-400 absolute left-4 pointer-events-none transition-colors" />
                <input 
                  type="text" 
                  value={searchVal}
                  onChange={handleSearch}
                  placeholder="Rechercher un jeu (GTA 6, FC 27, Steam, Game Pass...)"
                  className="w-full bg-black/50 hover:bg-black/70 focus:bg-black/90 border border-white/10 hover:border-white/20 focus:border-pink-500/60 rounded-full pl-11 pr-14 py-2 text-xs text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-1 focus:ring-pink-500/40 shadow-inner"
                />
                <span className="absolute right-3 px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-zinc-400 pointer-events-none border border-white/10 hidden lg:inline">Ctrl+K</span>
              </div>
            </div>

            {/* Right: Currency Pill & Circular Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Currency Selector Pill */}
              <div className="relative">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="appearance-none bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-pink-500/40 text-xs font-bold text-white rounded-full pl-3 sm:pl-4 pr-7 sm:pr-8 py-1.5 sm:py-2 cursor-pointer focus:outline-none transition shadow-sm"
                >
                  <option value="DZD" className="bg-slate-900 text-white">🇩🇿 DZD (DA)</option>
                  <option value="EUR" className="bg-slate-900 text-white">🇪🇺 EUR (€)</option>
                  <option value="USD" className="bg-slate-900 text-white">🇺🇸 USD ($)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Circular Cart Button */}
              <button 
                onClick={openCart} 
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 flex items-center justify-center text-zinc-200 hover:text-pink-300 transition cursor-pointer shadow-md group/cart"
                title="Panier"
              >
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover/cart:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#090b12] shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Circular Notification/Support Button */}
              <a 
                href="https://wa.me/213550000000?text=Bonjour%20IONARA%2C%20j%27ai%20besoin%20d%27assistance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 hidden sm:flex items-center justify-center text-zinc-200 hover:text-emerald-400 transition cursor-pointer shadow-md group/notif"
                title="Support Direct WhatsApp 24/7"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover/notif:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090b12]"></span>
              </a>

              {/* Circular User Profile Button */}
              {user ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs" title={user.username}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={logoutUser} 
                    className="p-1.5 rounded-full text-zinc-400 hover:text-rose-400 transition" 
                    title="Déconnexion"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={openAuth} 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-zinc-200 hover:text-purple-300 transition cursor-pointer shadow-md group/user"
                  title="Mon Espace Client"
                >
                  <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover/user:scale-110 transition-transform" />
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Mobile Dropdown Slide Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 rounded-3xl border border-white/10 bg-slate-950/98 backdrop-blur-2xl p-5 space-y-4 shadow-2xl animate-slide-up">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchVal}
                  onChange={handleSearch}
                  placeholder="Rechercher un jeu..."
                  className="w-full bg-black/60 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/60"
                />
              </div>

              <div className="flex flex-col gap-2.5 font-semibold text-xs">
                <a href="#featured" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-pink-400 py-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" /> En Vedette
                </a>
                <a href="#catalog" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-pink-400 py-1.5 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" /> Catalogue Complet
                </a>
                <a href="#spotlight" onClick={() => setMobileMenuOpen(false)} className="text-pink-400 py-1.5 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-pink-500" /> Pack 1000+ Jeux
                </a>
                <a href="#guide" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-pink-400 py-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Garantie & Activation
                </a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-pink-400 py-1.5 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Avis Clients
                </a>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-semibold">Devise :</span>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-white/[0.05] border border-white/10 text-xs font-bold text-white rounded-full px-3 py-1"
                >
                  <option value="DZD">🇩🇿 DZD (DA)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="USD">🇺🇸 USD ($)</option>
                </select>
              </div>
            </div>
          )}

        </div>
      </header>
    </>
  );
}
