export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100">
      {/* Page Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">À Propos de IONARA</h1>
          <p className="text-zinc-400 max-w-2xl">
            Découvrez l'histoire et les valeurs qui font de IONARA un leader depuis 25 ans dans le domaine des comptes et services gaming.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Company Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Notre Histoire</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2000 - Les Débuts</h3>
                <p className="text-zinc-400 space-y-2">
                  Fondée en 2000 par un passionné de gaming, IONARA a commencé comme un petit service d'échange de comptes entre amis dans une chambre d'étudiant à Alger.
                </p>
                <p className="text-xs text-zinc-500 pt-3 border-t border-white/[0.1]">
                  <span className="font-medium">2000</span> : Première transaction
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2005 - La Professionnalisation</h3>
                <p className="text-zinc-400 space-y-2">
                  Face à la demande croissante, IONARA s'est structurée en entreprise officielle, mettant en place les premiers processus de vérification et de sécurité.
                </p>
                <p className="text-xs text-zinc-500 pt-3 border-t border-white/[0.1]">
                  <span className="font-medium">2005</span> : Première équipe dédiée
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2010 - L'Expansion Internationale</h3>
                <p className="text-zinc-400 space-y-2">
                  Avec l'avènement des plateformes de jeu en ligne modernes, IONARA a élargi son catalogue pour inclure Steam, Xbox Live, PlayStation Network et bien plus.
                </p>
                <p className="text-xs text-zinc-500 pt-3 border-t border-white/[0.1]">
                  <span className="font-medium">2010</span> : Premiers comptes internationaux
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2015 - L'Ère du Service Premium</h3>
                <p className="text-zinc-400 space-y-2">
                  Consciente que les joueurs exigeaient bien plus que de simples comptes, IONARA a lancé son programme de services premium avec support dédié et garanties étendues.
                </p>
                <p className="text-xs text-zinc-500 pt-3 border-t border-white/[0.1]">
                  <span className="font-medium">2015</span> : Lancement du service premium
                </p>
              </div>
            </div>
          </div>

          {/* Values & Mission */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Nos Valeurs & Mission</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Sécurité Absolue</h3>
                <p className="text-zinc-400">
                  La sécurité de vos comptes et de vos données est notre priorité absolue. Nous investissons continuellement dans les meilleures technologies de protection.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <UserIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Confiance Durable</h3>
                <p className="text-zinc-400">
                  Construite sur 25 ans d'intégrité, notre réputation repose sur la transparence, l'honnêteté et le respect de nos engagements envers chaque client.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Gamepad2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Passion Gaming</h3>
                <p className="text-zinc-400">
                  Nous sommes avant tout des joueurs passionnés qui comprennent vos besoins, vos attentes et votre amour pour le gaming authentique.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="text-center pb-12">
            <h2 className="text-2xl font-bold text-white mb-8">25 Ans d'Excellence en Chiffres</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <p className="text-4xl font-bold text-pink-400 mb-2 drop-shadow(0 0 8px rgba(236,72,153,0.5))">100K+</p>
                <p className="text-zinc-400">Comptes Livrés</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <p className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow(0 0 8px rgba(250,204,21,0.5))">99.8%</p>
                <p className="text-zinc-400">Taux de Satisfaction</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <p className="text-4xl font-bold text-green-400 mb-2 drop-shadow(0 0 8px rgba(34,197,94,0.5))">25</p>
                <p className="text-zinc-400">Ans d'Expérience</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <p className="text-4xl font-bold text-blue-400 mb-2 drop-shadow(0 0 8px rgba(59,130,246,0.5))">500+</p>
                <p className="text-zinc-400">Partenaires Actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}