'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MessageCircle, 
  Instagram, 
  Mail, 
  Heart, 
  Lock,
  Zap
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950/95 pt-16 pb-12 text-zinc-400 text-xs">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <img 
                src="/assets/logo/ionara-wordmark.png" 
                alt="IONARA STORE" 
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow(0 0 12px rgba(216,104,209,0.5))"
              />
            </Link>

            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Votre boutique de confiance pour l'achat de comptes de jeux vidéo premium, clés d'activation et abonnements en Algérie et à l'international.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 text-zinc-300 hover:text-emerald-400 transition"
                title="Support WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/ionara"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 border border-white/10 text-zinc-300 hover:text-pink-400 transition"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@ionara.dz"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 text-zinc-300 hover:text-purple-400 transition"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase">Boutique</h5>
            <ul className="space-y-2">
              <li><a href="#featured" className="hover:text-pink-400 transition">En Vedette</a></li>
              <li><a href="#catalog" className="hover:text-pink-400 transition">Catalogue Complet</a></li>
              <li><a href="#spotlight" className="hover:text-pink-400 transition">Pack Steam 1,170+ Jeux</a></li>
              <li><a href="#guide" className="hover:text-pink-400 transition">Guide d'Installation</a></li>
              <li><a href="#reviews" className="hover:text-pink-400 transition">Avis Clients</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase">Catégories</h5>
            <ul className="space-y-2">
              <li><span className="text-zinc-400">Comptes Steam PC</span></li>
              <li><span className="text-zinc-400">Précommandes (GTA VI, FC 27)</span></li>
              <li><span className="text-zinc-400">Xbox Game Pass Ultimate</span></li>
              <li><span className="text-zinc-400">PlayStation Network (PS4 / PS5)</span></li>
              <li><span className="text-zinc-400">Points & Devises Gaming</span></li>
            </ul>
          </div>

          {/* Security & Warranty */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase">Nos Garanties</h5>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-zinc-300">
                <Zap className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Livraison 5 à 15 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Remplacement garanti à vie</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Paiements 100% sécurisés</span>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Methods Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] font-semibold text-zinc-400">
            <span>Moyens de paiement acceptés :</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">BaridiMob 🇩🇿</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">CCP 🇩🇿</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">Edahabia / CIB</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">Visa / Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">PayPal</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">USDT Crypto</span>
          </div>

          <div className="text-[11px] text-zinc-500 text-center md:text-right">
            <span>Support client 24/7 • WhatsApp : </span>
            <strong className="text-pink-300 font-mono">+213 550 00 00 00</strong>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 border-t border-white/5 text-center text-[10px] text-zinc-500 space-y-1">
          <p>© 2026 IONARA STORE. Tous droits réservés.</p>
          <p>
            Toutes les marques, logos de jeux, images et noms commerciaux mentionnés sont la propriété de leurs détenteurs respectifs (Steam, Sony, Microsoft, Rockstar, EA, Riot Games, etc.).
          </p>
        </div>

      </div>
    </footer>
  );
}
