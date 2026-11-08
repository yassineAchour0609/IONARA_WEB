'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Zap, Award, Headphones } from 'lucide-react';

const PLATFORMS = [
  { name: 'Steam PC', icon: '/assets/platforms/steam.png', desc: '1,200+ Jeux' },
  { name: 'PlayStation', icon: '/assets/platforms/playstation.png', desc: 'PS4 & PS5' },
  { name: 'Xbox Series / One', icon: '/assets/platforms/xbox.png', desc: 'Game Pass Ultimate' },
  { name: 'Riot Games', icon: '/assets/platforms/riot.png', desc: 'Valorant & LoL' },
  { name: 'Rockstar Games', icon: '/assets/platforms/rockstar.jpg', desc: 'GTA & RDR' },
  { name: 'Roblox', icon: '/assets/platforms/roblox.png', desc: 'Robux & Items' },
];

const TRUST_METRICS = [
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    title: 'Livraison Rapide',
    subtitle: '5 à 15 min après paiement',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    title: 'Garantie à Vie',
    subtitle: 'Remplacement garanti',
  },
  {
    icon: <Award className="w-5 h-5 text-pink-400" />,
    title: '100% Officiel & Sûr',
    subtitle: 'Zéro risque de ban',
  },
  {
    icon: <Headphones className="w-5 h-5 text-cyan-400" />,
    title: 'Support 7j/7 WhatsApp',
    subtitle: 'Assistance dédiée en continu',
  },
];

export default function PlatformsBar({ onSelectPlatform }: { onSelectPlatform?: (platform: string) => void }) {
  return (
    <section className="relative z-10 -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Platforms Carousel/Grid */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-4">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Plateformes & Écosystèmes Pris En Charge
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {PLATFORMS.map((plat) => (
            <div
              key={plat.name}
              onClick={() => onSelectPlatform && onSelectPlatform(plat.name)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-pink-500/40 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/40 p-1.5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition">
                <img
                  src={plat.icon}
                  alt={plat.name}
                  className="w-full h-full object-contain filter group-hover:brightness-125"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-pink-300 truncate transition">
                  {plat.name}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">{plat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {TRUST_METRICS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
              <div className="p-2 rounded-lg bg-white/[0.05] shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{item.title}</p>
                <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
