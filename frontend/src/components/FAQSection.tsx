'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Comment vais-je recevoir mon compte ou mon jeu après le paiement ?',
    a: 'Dès validation de votre paiement (BaridiMob, CCP, CB ou PayPal), nos agents vous transmettent les identifiants complets (Email, Mot de passe, Code Steam Guard / OTP si applicable) directement sur votre numéro WhatsApp ou par email en 5 à 15 minutes. Un guide étape par étape avec capture d\'écran vous est fourni.',
  },
  {
    q: 'Quels sont les moyens de paiement acceptés en Algérie ?',
    a: 'Nous acceptons principalement le virement instantané BaridiMob (le plus rapide), le virement CCP par la poste, les Cartes Bancaires (CIB, Edahabia, Visa, Mastercard), ainsi que PayPal et Crypto (USDT). Vous pouvez aussi régler en contactant notre agent sur WhatsApp.',
  },
  {
    q: 'Comment fonctionne le Pack Steam Ultime 1,170+ Jeux ?',
    a: 'Le Pack Steam vous donne un accès officiel à un compte disposant de la bibliothèque de plus de 1,170 jeux. Vous installez les jeux voulus directement via l\'application Steam officielle. Une fois téléchargés, vous passez en mode Hors-Ligne pour jouer en solo de manière illimitée, tout en conservant vos sauvegardes personnelles sur votre PC.',
  },
  {
    q: 'Les comptes sont-ils garantis ? Que se passe-t-il en cas de problème ?',
    a: 'Tous nos comptes bénéficient d\'une garantie de remplacement à vie. Si vous rencontrez la moindre difficulté de connexion ou de mise à jour, notre support technique WhatsApp intervient sous quelques minutes pour réinitialiser l\'accès ou vous fournir un compte de remplacement équivalent sans frais supplémentaires.',
  },
  {
    q: 'Y a-t-il un risque pour ma console (PS5/Xbox) ou mon PC ?',
    a: 'Absolument aucun. Tous nos comptes utilisent des licences légales achetées sur les boutiques officielles (PlayStation Store, Xbox Live, Steam, Riot). Vous n\'avez besoin d\'aucun crack, mod illégal ou manipulation à risque.',
  },
  {
    q: 'Comment précommander GTA VI ou EA FC 27 ?',
    a: 'Il vous suffit de sélectionner le jeu et de valider votre commande. Vous recevez un reçu de précommande numérique officiel. Dès l\'ouverture des préchargements officiels avant la sortie mondiale, vos identifiants ou clé d\'activation vous seront livrés en priorité.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="guide" className="relative py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
          Foire Aux Questions & Guide
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-headline mt-3">
          Questions <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Fréquentes</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2">
          Tout ce que vous devez savoir avant et après votre achat sur IONARA STORE.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-white/[0.05] border-pink-500/40 shadow-lg shadow-pink-500/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-pink-400 shrink-0" />
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-pink-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Banner */}
      <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-base font-bold text-white">Vous avez une autre question ?</h4>
          <p className="text-xs text-zinc-400 mt-0.5">Notre équipe technique répond en direct sur WhatsApp 7j/7.</p>
        </div>
        <a
          href="https://wa.me/213550000000?text=Bonjour%20IONARA%2C%20j%27ai%20une%20question%20avant%20de%20commander"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Discuter sur WhatsApp
        </a>
      </div>
    </section>
  );
}
