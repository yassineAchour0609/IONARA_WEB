export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100">
      {/* Page Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Nos Services Professionnels</h1>
          <p className="text-zinc-400 max-w-2xl">
            Fort de 25 ans d'expérience dans l'industrie du gaming, IONARA propose une gamme complète de services dédiés aux joueurs exigeants et aux professionnels du secteur.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {/* Service 1: Vérification & Sécurité */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Vérification & Sécurité</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Tous nos comptes passent par un processus de vérification rigoureux en 7 étapes pour garantir leur authenticité et leur sécurité.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Contrôle d'authenticité
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Audit de sécurité complet
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Garantie de récupération
              </p>
            </div>

            {/* Service 2: Support Client dédié */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-2">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Support Client dédié</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Notre équipe d'experts gaming est disponible 7j/7 pour vous conseiller, vous assister et résoudre toute difficulté liée à votre achat.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Assistance en français
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Temps de réponse < 2h
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Support technique spécialisé
              </p>
            </div>

            {/* Service 3: Livraison Instantanée & Garantie */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Livraison Instantanée</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Livraison automatique des identifiants par email sécurisé et notification WhatsApp en moins de 15 minutes après validation du paiement.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Livraison sous 15 min
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Email & WhatsApp sécurisés
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Garantie de remplacement
              </p>
            </div>

            {/* Service 4: Meilleures Prix du Marché */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Meilleurs Prix du Marché</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Grâce à nos 25 ans d'expérience et à notre réseau de fournisseurs établis, nous garantissons les prix les plus compétitifs du marché algérien et international.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Prix transparents
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Pas de frais cachés
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Offres spéciales régulières
              </p>
            </div>

            {/* Service 5: Programme de Fidélité */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Programme de Fidélité</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Rejoignez notre club des joueurs expérimentés et bénéficiez d'avantages exclusifs : réductions permanentes, accès anticipé aux nouveautés, et conseils personnalisés.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Réductions cumulatives
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Accès VIP aux nouveautés
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Conseils d'experts personnalisés
              </p>
            </div>

            {/* Service 6: Expertise & Conseil */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white ml-3">Expertise & Conseil</h3>
              </div>
              <p className="text-zinc-400 mb-4">
                Notre équipe composée d'anciens joueurs professionnels et d'experts de l'industrie vous guide dans vos choix pour optimiser votre expérience gaming selon vos besoins spécifiques.
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-4">
                ✓ Analyse de profil gaming
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit mb-1">
                ✓ Recommandations personnalisées
              </p>
              <p className="text-xs text-zinc-500 bg-white/[0.03] px-3 py-1 rounded w-fit">
                ✓ Mise à jour régulière des connaissances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto text-center border border-white/[0.05] rounded-xl p-8 bg-white/[0.02]">
          <h2 className="text-2xl font-bold text-white mb-4">
            Prêt à profiter de notre expertise ?
          </h2>
          <p className="text-zinc-400 mb-6">
            Rejoignez les milliers de clients satisfaits qui nous font confiance depuis plus de deux décennies.
          </p>
          <a href="/catalogue"
             className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-shadow hover:shadow-lg">
            Découvrir le Catalogue
          </a>
        </div>
      </div>
    </div>
  );
}