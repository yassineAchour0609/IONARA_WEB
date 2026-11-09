'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Search, Compass, ListMusic, Zap, Check } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface HeroProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onExploreCatalog?: () => void;
}

export default function Hero({ 
  onSearchChange,
  searchValue = '' 
}: HeroProps) {
  const { openQuickView, openCatalogModal, formatPrice } = useShop();
  const gta = PRODUCTS.find((p) => p.slug === 'gta-6') || PRODUCTS[1];

  return (
    <section className="relative z-10 pt-10 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Taglines & Live Search */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">
                BOUTIQUE OFFICIELLE DE JEUX VIDÉO
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs font-semibold text-zinc-300">Livraison 5-15 min</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-headline">
              L'UNIVERS DU GAMING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
                AU MEILLEUR PRIX.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Achetez vos <strong>comptes de jeux vidéo</strong> vérifiés en toute sécurité. Accès complet avec email et mot de passe personnalisables, garantie anti-bannissement et support client 24/7.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <a
                href="#catalog"
                className="btn-neon-magenta px-8 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-xl"
              >
                <Compass className="w-5 h-5" />
                Explorer le Catalogue
              </a>
              <button
                onClick={openCatalogModal}
                className="btn-neon-outline px-6 py-3.5 rounded-xl font-bold text-zinc-200 text-sm sm:text-base hover:text-white transition cursor-pointer flex items-center gap-2"
              >
                <ListMusic className="w-5 h-5 text-pink-400" />
                <span>+1,170 Jeux Listés</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-headline">+1,170</div>
                <div className="text-xs text-zinc-400 font-medium">Jeux en Stock</div>
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-headline">+15,400</div>
                <div className="text-xs text-zinc-400 font-medium">Comptes Livrés</div>
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-headline">4.9 / 5</div>
                <div className="text-xs text-zinc-400 font-medium">Note Vérifiée (⭐)</div>
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-headline">5-15m</div>
                <div className="text-xs text-zinc-400 font-medium">Livraison Express</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 opacity-40 blur-2xl animate-pulse"></div>

              <div className="relative rounded-3xl border border-white/20 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-pink-400">
                    <Zap className="w-4 h-4 fill-pink-400" /> OFFRE VEDETTE DU JOUR
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
                    GARANTIE TOTALE
                  </span>
                </div>

                <div 
                  className="relative mt-3 rounded-2xl overflow-hidden aspect-[4/5] bg-black/50 group cursor-pointer"
                  onClick={() => openQuickView(gta)}
                >
                  <img
                    src={gta.image}
                    alt={gta.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5">
                    <span className="px-2.5 py-0.5 rounded bg-pink-600 text-white font-bold text-[10px] uppercase tracking-wider">
                      {gta.badge}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">{gta.title}</h3>
                    <p className="text-xs text-zinc-300 mt-0.5">{gta.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-extrabold text-white">
                        {formatPrice(gta.priceTND || gta.priceDZD || 79, gta.priceEUR, gta.priceUSD)}
                      </span>
                      <button className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-400 transition shadow-lg">
                        Voir l'offre →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Email modifiable
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Check className="w-3.5 h-3.5" /> Pas de VPN requis
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Check className="w-3.5 h-3.5" /> Support 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
