'use client';

import React from 'react';
import { Star, CheckCircle, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Karim B.',
    location: 'Alger (Hydra)',
    game: 'Pack Steam 1,170+ Jeux',
    rating: 5,
    date: 'Il y a 2 jours',
    comment: 'Franchement le meilleur achat gaming de l’année ! Plus de 1000 jeux prêts à être installés sans aucun souci, téléchargement direct sur Steam. BaridiMob validé en 5 minutes chrono !',
    verified: true,
  },
  {
    name: 'Yacine M.',
    location: 'Oran',
    game: 'Grand Theft Auto VI (PS5)',
    rating: 5,
    date: 'Il y a 3 jours',
    comment: 'Précommande validée avec reçu officiel. Le support sur WhatsApp m’a répondu à 23h en moins de 3 minutes pour tout m’expliquer. Service au top, continuez comme ça !',
    verified: true,
  },
  {
    name: 'Sofiane K.',
    location: 'Constantine',
    game: 'EA SPORTS FC 27 & 26',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment: 'J’ai acheté FC et Xbox Game Pass. Tout fonctionne nickel sur ma Xbox Series X. Prix imbattable en dinars, ça évite les cartes bancaires internationales.',
    verified: true,
  },
  {
    name: 'Walid T.',
    location: 'Annaba',
    game: 'Call of Duty: Black Ops 7',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment: 'Compte reçu avec accès complet. J’ai pu changer l’email et sécuriser à 100%. Aucune arnaque, c’est du sérieux IONARA.',
    verified: true,
  },
  {
    name: 'Mehdi R.',
    location: 'Sétif',
    game: 'Pack 5,000 Points Valorant',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Riot Points crédités directement via code. J’ai pu acheter le battle pass immédiatement. Vendeur recommandé à 100% !',
    verified: true,
  },
  {
    name: 'Adel H.',
    location: 'Béjaïa',
    game: 'Xbox Game Pass Ultimate 1 An',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: '1 an de Game Pass pour le tiers du prix officiel, c’est imbattable. Guide d’activation clair envoyé avec une vidéo explicative.',
    verified: true,
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
          ★ 4.9/5 Sur Plus De 1,400 Commandes
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-headline mt-3">
          Ce que disent nos <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Gamers Satisfaits</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2">
          Découvrez les retours authentiques de notre communauté en Algérie et à l'international.
        </p>
      </div>

      {/* Trust Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white font-headline">12,450+</p>
          <p className="text-xs text-zinc-400 mt-0.5">Comptes & Clés Livrés</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-headline">99.4%</p>
          <p className="text-xs text-zinc-400 mt-0.5">Taux de Satisfaction</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
          <p className="text-2xl sm:text-3xl font-black text-pink-400 font-headline">&lt; 15 min</p>
          <p className="text-xs text-zinc-400 mt-0.5">Délai Moyen de Livraison</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
          <p className="text-2xl sm:text-3xl font-black text-purple-400 font-headline">24/7</p>
          <p className="text-xs text-zinc-400 mt-0.5">Support WhatsApp Réactif</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REVIEWS.map((rev, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 hover:border-pink-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Rating stars & verified badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> Achat vérifié
                  </span>
                )}
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{rev.name}</p>
                <p className="text-[10px] text-zinc-400">{rev.location}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-pink-400 font-semibold">{rev.game}</p>
                <p className="text-[9px] text-zinc-500">{rev.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
