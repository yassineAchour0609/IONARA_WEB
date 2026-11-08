'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { 
  X, 
  Search, 
  Gamepad2, 
  ShoppingCart, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Flame
} from 'lucide-react';

interface GameItem {
  id: number;
  title: string;
}

export default function GamesCatalogModal() {
  const { isCatalogModalOpen, closeCatalogModal, addToCart, showToast } = useShop();

  const [games, setGames] = useState<GameItem[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 48;

  const packProduct = PRODUCTS.find((p) => p.slug === 'pack-steam-1000-jeux') || PRODUCTS[0];

  useEffect(() => {
    fetch('/assets/games_list.json')
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error('Error loading games:', err));
  }, []);

  const filteredGames = useMemo(() => {
    if (!search.trim()) return games;
    const term = search.toLowerCase();
    return games.filter((g) => g.title.toLowerCase().includes(term));
  }, [games, search]);

  const totalPages = Math.ceil(filteredGames.length / pageSize) || 1;

  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGames.slice(start, start + pageSize);
  }, [filteredGames, currentPage]);

  const handleCopy = (g: GameItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(g.title);
      setCopiedId(g.id);
      setTimeout(() => setCopiedId(null), 1500);
      showToast(`"${g.title}" copié !`, 'info');
    }
  };

  if (!isCatalogModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div onClick={closeCatalogModal} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-slate-950 border border-purple-500/30 p-5 sm:p-7 shadow-2xl shadow-purple-500/20 z-10 flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-headline">
                  Catalogue Steam Pack
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                  {games.length || 1176} Jeux Inclus
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Tous ces jeux sont disponibles dans un seul compte à vie avec sauvegardes locales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addToCart(packProduct);
                closeCatalogModal();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Commander le Pack (1,176 jeux)</span>
            </button>

            <button
              onClick={closeCatalogModal}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher parmi les 1,176 jeux (ex: GTA, Witcher, Baldur, God of War...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="text-xs text-zinc-400 font-semibold flex items-center justify-between sm:justify-end gap-3">
            <span>
              Résultats : <strong className="text-white">{filteredGames.length}</strong> jeux trouvés
            </span>
            <span>
              Page <strong className="text-white">{currentPage}</strong> sur {totalPages}
            </span>
          </div>
        </div>

        {/* Games Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-2 custom-scrollbar">
          {paginatedGames.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-zinc-400 font-medium">Aucun jeu ne correspond à "{search}"</p>
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-pink-400 hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {paginatedGames.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleCopy(g)}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/5 hover:border-purple-500/40 flex items-center justify-between gap-2 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-500 w-7 shrink-0">#{g.id}</span>
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                      {g.title}
                    </span>
                  </div>
                  <button
                    className="p-1 rounded text-zinc-500 group-hover:text-purple-300 hover:bg-white/10 transition shrink-0"
                    title="Copier le nom"
                  >
                    {copiedId === g.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-white font-semibold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Page {currentPage} / {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-white font-semibold flex items-center gap-1 transition"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
