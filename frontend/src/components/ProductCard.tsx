'use client';

import React from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { ShoppingCart, Eye, Star, Zap, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, formatPrice, openQuickView } = useShop();

  const discountPercent = Math.round(
    ((product.oldPriceDZD - product.priceDZD) / product.oldPriceDZD) * 100
  );

  return (
    <div className="group relative flex flex-col rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-white/10 hover:border-pink-500/50 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-3.5">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-pink-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            {product.badge}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Platform Pill at Bottom of Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold flex items-center gap-1.5">
            {product.platformIcon && (
              <img src={product.platformIcon} alt="" className="w-3.5 h-3.5 object-contain" />
            )}
            {product.platform}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-zinc-300 font-medium">
            {product.tag}
          </span>
        </div>

        {/* Quick View Overlay Button on Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => openQuickView(product)}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Aperçu rapide
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-white">{product.rating}</span>
            <span className="text-[10px] text-zinc-400">({product.reviewsCount})</span>
            <span className="ml-auto text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" /> {product.delivery}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => openQuickView(product)}
            className="font-headline font-bold text-base text-white group-hover:text-pink-300 transition line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{product.subtitle}</p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white font-headline">
                {formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
              </span>
            </div>
            {product.oldPriceDZD > product.priceDZD && (
              <span className="text-[10px] text-zinc-500 line-through">
                {formatPrice(product.oldPriceDZD, product.oldPriceEUR, product.oldPriceUSD)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition cursor-pointer shrink-0"
            title="Ajouter au panier"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>

      </div>

    </div>
  );
}
