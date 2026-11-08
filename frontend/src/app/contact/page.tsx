export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100">
      {/* Page Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Contactez-Nous</h1>
          <p className="text-zinc-400 max-w-2xl">
            Notre équipe est disponible pour répondre à toutes vos questions et vous assister dans votre expérience d'achat.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Informations de Contact</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-3">Support Client</h3>
                <p className="text-zinc-300 space-y-2">
                  <span className="font-medium">📧 Email :</span> support@ionara.dz
                </p>
                <p className="text-zinc-300 space-y-2">
                  <span className="font-medium">💬 WhatsApp :</span> +213 555 123 456
                </p>
                <p className="text-zinc-300 space-y-2">
                  <span className="font-medium">🕒 Horaires :</span> 9h00 - 21h00 (7j/7)
                </p>
                <p className="text-zinc-300 mt-4">
                  <span className="font-medium">⏱️ Temps de réponse moyen :</span> < 2 heures
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-3">Suivez-Nous</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-zinc-300 hover:text-pink-400 transition-colors">
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a href="#" className="text-zinc-300 hover:text-pink-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a href="#" className="text-zinc-300 hover:text-pink-400 transition-colors">
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a href="#" className="text-zinc-300 hover:text-pink-400 transition-colors">
                    <span className="sr-only">YouTube</span>
                  </a>
                </div>
                <p className="text-zinc-400 mt-4">
                  Rejoignez notre communauté pour les dernières nouveautés et offres exclusives
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envoyer un Message</h2>
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez votre nom complet"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10
                              text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none
                              focus:border-pink-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    placeholder="votrenom@exemple.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10
                              text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none
                              focus:border-pink-500/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Sujet
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10
                            text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none
                            focus:border-pink-500/50"
                >
                  <option value="">Sélectionner un sujet</option>
                  <option value="compte">Question sur un compte</option>
                  <option value="technique">Support technique</option>
                  <option facture">Question sur une facture</option>
                  <option value="partenariat">Demande de partenariat</option>
                  <option value="autre">Autre sujet</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Décrivez votre demande en détail..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10
                            text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none
                            focus:border-pink-500/50"
                ></textarea>
              </div>

              <div className="flex items-center justify-start">
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium
                            rounded-xl transition-shadow hover:shadow-lg flex items-center gap-2"
                >
                  <span>Envoyer le Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Pourquoi Nous Faire Confiance ?</h2>
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-pink-400">🔒</span>
              <span className="ml-2 text-xs text-zinc-300">Sécurité Garantie</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-yellow-400">💰</span>
              <span className="ml-2 text-xs text-zinc-300">Prix Transparents</span>
            </div
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-green-400">🚚</span>
              <span className="ml-2 text-xs text-zinc-300">Livraison Rapide</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-blue-400">🎧</span>
              <span className="ml-2 text-xs text-zinc-300">Support 7j/7</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-purple-400">📋</span>
              <span className="ml-2 text-xs text-zinc-300">Politique Claire</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <span className="text-xs font-medium text-indigo-400">⭐</span>
              <span className="ml-2 text-xs text-zinc-300">Avis Vérifiés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}