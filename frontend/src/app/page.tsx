import Link from 'next/link';
import { Flame, CreditCard, Coins, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-pink-900 animate-background-gradient">
        <style jsx>{`
          @keyframes background-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-background-gradient {
            background-size: 400% 400%;
            animation: background-gradient 15s ease infinite;
          }

          @keyframes logo-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-logo-pulse {
            animation: logo-pulse 3s ease-in-out infinite;
          }

          @keyframes text-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-text {
            background-size: 200% auto;
            animation: text-gradient 3s linear infinite;
          }

          @keyframes text-gradient-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-text-gradient {
            background-size: 200% auto;
            animation: text-gradient-slow 4s ease-in-out infinite;
          }
        `}</style>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src="/assets/logo/ionara-logo.svg"
                alt="IONARA"
                className="h-36 w-auto drop-shadow(0 0 16px rgba(30,64,175,0.6)) animate-logo-pulse"
              />
              <div className="text-center">
                <p className="text-xs font-medium text-zinc-300 tracking-wider animate-text-gradient">
                  25 ANS D'EXPERTISE
                </p>
                <p className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 animate-text">
                  IONARA
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 animate-text mb-4">
            Excellence et Confiance dans le Gaming depuis 2000
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto animate-text-gradient">
            Leader reconnu en Algérie pour les comptes de jeux vérifiés, les abonnements légitimes et le support professionnel.
            Notre expertise de deux décennies garantit sécurité, fiabilité et satisfaction totale.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="/catalogue"
               className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] shadow-2xl shadow-pink-500/50 hover:shadow-2xl hover:shadow-pink-600/60">
              Explorer le Catalogue
            </a>
            <a href="/services"
               className="px-6 py-3 bg-white/[0.1] hover:bg-white/[0.15] text-zinc-200 hover:text-white font-medium rounded-xl border border-white/[0.2] transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] shadow-inner">
              Nos Services
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Statistics */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div className="bg-white/[0.03] border border-gray-600 rounded-xl p-6">
              <p className="text-3xl font-bold text-pink-400 mb-2 drop-shadow(0 0 8px rgba(236,72,153,0.5))">100K+</p>
              <p className="text-lg text-gray-700">Comptes Livrés</p>
            </div>
            <div className="bg-white/[0.03] border border-gray-600 rounded-xl p-6">
              <p className="text-3xl font-bold text-yellow-400 mb-2 drop-shadow(0 0 8px rgba(250,204,21,0.5))">99.8%</p>
              <p className="text-lg text-gray-700">Taux de Satisfaction</p>
            </div
            <div className="bg-white/[0.03] border border-gray-600 rounded-xl p-6">
              <p className="text-3xl font-bold text-green-400 mb-2 drop-shadow(0 0 8px rgba(34,197,94,0.5))">25</p>
              <p className="text-lg text-gray-700">Ans d'Expérience</p>
            </div>
            <div className="bg-white/[0.03] border border-gray-600 rounded-xl p-6">
              <p className="text-3xl font-bold text-blue-400 mb-2 drop-shadow(0 0 8px rgba(59,130,246,0.5))">500+</p>
              <p className="text-lg text-gray-700">Partenaires Actifs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Nos Domaines d'Expertise
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Steam & Platforms */}
            <Link href="/catalogue" className="bg-white hover:bg-gray-100 border border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                <div className="w-14 h-14 bg-pink-500/20 rounded-flex items-center justify-center mb-2">
                  <Flame className="w-7 h-7 text-pink-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Steam & Plateformes
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Comptes Steam, jeux récents, DLC et contenus exclusifs
              </p>
            </Link>

            {/* Abonnements */}
            <Link href="/catalogue" className="bg-white hover:bg-gray-100 border border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-flex items-center justify-center mb-2">
                  <CreditCard className="w-7 h-7 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Abonnements Gaming
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Xbox Game Pass, PlayStation Plus, Nintendo Switch Online et plus
              </p>
            </Link>

            {/* Monnaie In-Game */}
            <Link href="/catalogue" className="bg-white hover:bg-gray-100 border border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                <div className="w-14 h-14 bg-green-500/20 rounded-flex items-center justify-center mb-2">
                  <Coins className="w-7 h-7 text-green-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Monnaie In-Game
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Gemmes, pièces, crédits et monnaies virtuelles pour tous les jeux populaires
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 animate-text mb-6">
            Prêt à découvrir notre expertise ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-text-gradient">
            Contactez notre équipe professionnelle pour bénéficier de notre savoir-faire de 25 ans dans le domaine du gaming professionnel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/catalogue"
               className="px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] shadow-2xl shadow-pink-500/50 hover:shadow-2xl hover:shadow-pink-600/60">
              Explorer le Catalogue
            </a>
            <a href="/contact"
               className="px-8 py-4 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-medium rounded-xl border border-yellow-400/50 hover:border-yellow-300 transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95]">
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Simple Version */}
      <footer className="border-t border-white/[0.08]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-zinc-400">
                © 2000-2025 IONARA. Tous droits réservés.
              </div>
              <div className="flex flex-row sm:flex-row gap-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Confidentialité
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Conditions
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}