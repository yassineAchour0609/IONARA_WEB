'use client';

import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useState, useMemo } from 'react';
import { Sparkles, Gamepad2, Flame, CreditCard, Coins, Search, SlidersHorizontal, X } from 'lucide-react';

export default function CataloguePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const CATEGORIES = [
    { id: 'all', label: 'Tous les Articles', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'steam', label: 'Steam & Packs', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'preorder', label: 'Précommandes', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'nouveautes', label: 'Nouveautés', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'passes', label: 'Abonnements', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'currencies', label: 'Points Gaming', icon: <Coins className="w-3.5 h-3.5" /> },
  ];

  // Filter products based on search, category, platform, and sort
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Platform filter
      if (selectedPlatform && !product.platform.toLowerCase().includes(selectedPlatform.toLowerCase())) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchPlatform = product.platform.toLowerCase().includes(query);
        const matchTag = product.tag.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchPlatform && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceDZD - b.priceDZD;
      if (sortBy === 'price-desc') return b.priceDZD - a.priceDZD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [activeCategory, selectedPlatform, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100">
      {/* Page Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Catalogue Complet</h1>
          <p className="text-zinc-400 max-w-2xl">
            Découvrez notre sélection vérifiée de comptes de jeux vidéo, abonnements et devises in-game.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Tabs */}
        <div className="mb-6">
          <span className="text-xs font-medium text-zinc-400 mb-2 block">
            Catégories
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2
                  ${activeCategory === cat.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/[0.05] text-zinc-300 hover:bg-white/[0.08] hover:text-white'}
                `}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre (GTA, FIFA, COD, Game Pass...)"
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10
                        text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Platform Filter */}
          {selectedPlatform && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30">
              <span className="text-sm font-medium text-pink-300">
                Plateforme : {selectedPlatform}
              </span>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="p-1 rounded hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/[0.05] border border-white/10 text-sm text-zinc-200 rounded-xl px-3 py-2
                        cursor-pointer focus:outline-none"
            >
              <option value="popular">Trier par : Popularité</option>
              <option value="price-asc">Prix : Moins cher</option>
              <option value="price-desc">Prix : Plus cher</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
          <h3 className="text-lg font-bold text-white mb-2">Aucun produit trouvé</h3>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Aucun résultat ne correspond à votre recherche ou filtre actuel.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setSelectedPlatform(null);
            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500
                      text-white text-sm font-bold transition"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}