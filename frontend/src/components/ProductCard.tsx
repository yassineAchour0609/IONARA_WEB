'use client';
import { Plus, ArrowUpRight, Heart, Star } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import type { Product } from '@/types';
import type { MessageKey } from '@/i18n';
export function ProductCard({ product }: { product: Product }) {
  const s = useShop();
  const live = s.catalog.find(p => p.slug === product.slug) || product;
  const fav = s.favorites.includes(live.slug);
  const soldCount = live.soldCount ?? 50;
  const rating = live.rating ?? 4.9;
  return <article className="product-card">
    <div className="product-media">
      <button className="product-image" onClick={() => s.setProduct(live)} aria-label={s.t('details') + ': ' + s.title(live)}>
        <img src={live.image} alt={s.title(live)} width="600" height="600" loading="lazy" />
        <span className="product-category">{s.t(live.category as MessageKey)}</span>
        <span className="image-arrow"><ArrowUpRight size={20} /></span>
      </button>
      <button type="button" className={fav ? 'fav-button active' : 'fav-button'} aria-label={s.t('favorites') + ': ' + s.title(live)} aria-pressed={fav} onClick={() => s.toggleFavorite(live.slug)}>
        <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
      </button>
    </div>
    <div className="product-info">
      <div className="product-meta-row">
        <span className="eyebrow">{live.platform}</span>
        {live.inStock && <span className="stock-pill"><span className="stock-dot" />{s.t('inStockBadge')}</span>}
      </div>
      <div className="product-social-row">
        <span className="rating-pill"><Star size={12} fill="currentColor" />{rating.toFixed(1)}</span>
        <span className="sold-pill">{soldCount} {s.t('soldBadge')}</span>
      </div>
      <h3><button onClick={() => s.setProduct(live)}>{s.title(live)}</button></h3>
      <div className="product-bottom"><strong>{s.formatPrice(live.prices[s.currency])}</strong><button className="icon-button add-button" aria-label={s.t('add') + ': ' + s.title(live)} disabled={!live.inStock} onClick={() => s.add(live)}><Plus size={20} /></button></div>
    </div>
  </article>;
}
