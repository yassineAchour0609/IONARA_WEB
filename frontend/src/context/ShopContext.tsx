'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { dictionaries, intlLocale, type Locale, type MessageKey } from '@/i18n';
import { api, ApiError } from '@/lib/api';
import type { CartItem, CurrencyCode, Product, User } from '@/types';

function useStore(initialLocale: Locale) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [currency, setCurrencyState] = useState<CurrencyCode>('TND');
  const [catalog, setCatalog] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [modal, setModal] = useState<'cart' | 'auth' | 'checkout' | 'library' | 'account' | 'legal' | 'track' | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [config, setConfig] = useState({ contactEmail: 'IonaraShop@outlook.fr', whatsapp: '21627031500', instagram: 'https://www.instagram.com/ionara_shop/' });
  const t = (key: MessageKey): string => dictionaries[locale][key];
  const errorText = (error: unknown) => t(error instanceof ApiError && error.code in dictionaries.fr ? error.code as MessageKey : 'SERVICE_UNAVAILABLE');
  const formatPrice = (value: number | null, code = currency) => value === null ? t('unpriced') : new Intl.NumberFormat(intlLocale[locale], { style: 'currency', currency: code }).format(value);
  const title = (p: Product) => p.slug === 'pack-1000-games' ? t('packTitle') : p.slug === 'xbox-game-pass-ultimate-1year' ? t('passYear') : p.slug === 'xbox-game-pass-ultimate-6months' ? t('passHalf') : p.slug === 'ionara-gift-card' ? t('giftCardTitle') : p.title;
  const description = (p: Product) => t(({ steam: 'steamDesc', preorder: 'preorderDesc', passes: 'passesDesc', currencies: 'currenciesDesc' } as Record<string, MessageKey>)[p.category] || 'gameDesc');
  const refreshCatalog = useCallback(() => {
    api<{ data: Product[] }>('/products').then(res => {
      if (Array.isArray(res.data) && res.data.length) setCatalog(res.data);
    }).catch(() => {});
  }, []);
  const refreshUser = useCallback(() => {
    api<{ user: User }>('/auth/me').then(data => setUser(data.user)).catch(() => setUser(null));
  }, []);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('ionara_cart_v2') || '[]');
      if (Array.isArray(saved)) {
        const seen = new Set<string>();
        setCart(saved.filter((item): item is CartItem => {
          if (!item || typeof item !== 'object') return false;
          const prod = PRODUCTS.find(p => p.slug === item.slug);
          const planOk = !item.planId || Boolean(prod?.plans?.some(pl => pl.id === item.planId));
          const key = item.planId ? `${item.slug}:${item.planId}` : item.slug;
          const valid = Boolean(prod) && planOk && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10 && !seen.has(key);
          if (valid) seen.add(key);
          return valid;
        }).slice(0, 50));
      }
      const savedFavs: unknown = JSON.parse(localStorage.getItem('ionara_favorites_v1') || '[]');
      if (Array.isArray(savedFavs)) setFavorites(savedFavs.filter((s): s is string => typeof s === 'string' && PRODUCTS.some(p => p.slug === s)));
      const savedCurrency = localStorage.getItem('ionara_currency_v2');
      if (['TND','EUR','USD'].includes(savedCurrency || '')) setCurrencyState(savedCurrency as CurrencyCode);
      for (const key of ['ionara_token', 'ionara_user']) localStorage.removeItem(key);
    } catch { /* Storage may be blocked; the shop still works in memory. */ }
    setReady(true);
    refreshUser();
    refreshCatalog();
    api<typeof config>('/config').then(c => setConfig(old => ({ ...old, ...c }))).catch(() => {});
  }, [refreshCatalog, refreshUser]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('ionara_cart_v2', JSON.stringify(cart));
      localStorage.setItem('ionara_favorites_v1', JSON.stringify(favorites));
      localStorage.setItem('ionara_currency_v2', currency);
    } catch { /* Private browsing may disable storage. */ }
  }, [cart, favorites, currency, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  function setLocale(value: Locale) {
    setLocaleState(value);
    document.cookie = 'ionara_locale=' + value + ';path=/;max-age=31536000;samesite=lax';
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    router.refresh();
  }
  const close = useCallback(() => { setModal(null); setProduct(null); }, []);
  const itemKey = (i: { slug: string; planId?: string }) => i.planId ? `${i.slug}:${i.planId}` : i.slug;
  const add = (p: Product, planId?: string, playerAccount?: string) => {
    const targetKey = planId ? `${p.slug}:${planId}` : p.slug;
    const cleanAccount = playerAccount?.trim() || undefined;
    setCart(old => {
      const existing = old.find(i => itemKey(i) === targetKey);
      return existing
        ? old.map(i => itemKey(i) === targetKey ? { ...i, quantity: Math.min(10, i.quantity + 1), ...(cleanAccount ? { playerAccount: cleanAccount } : {}) } : i)
        : [...old, { slug: p.slug, ...(planId ? { planId } : {}), ...(cleanAccount ? { playerAccount: cleanAccount } : {}), quantity: 1 }];
    });
    setToast(t('added'));
  };
  const addBundle = (slugs: string[], tier: 3 | 5) => {
    setCart(old => {
      const next = [...old];
      for (const slug of slugs) {
        const idx = next.findIndex(i => itemKey(i) === slug);
        if (idx >= 0) next[idx] = { ...next[idx], quantity: Math.min(10, next[idx].quantity + 1) };
        else next.push({ slug, quantity: 1 });
      }
      return next;
    });
    setPromoCode(tier === 5 ? 'BUNDLE5' : 'BUNDLE3');
    setToast(t('promoApplied'));
    setModal('cart');
  };
  const toggleFavorite = (slug: string) => {
    setFavorites(old => {
      const exists = old.includes(slug);
      setToast(t(exists ? 'favoriteRemoved' : 'favoriteAdded'));
      return exists ? old.filter(s => s !== slug) : [...old, slug];
    });
  };
  const updateQuantity = (keyOrSlug: string, quantity: number) => setCart(old => quantity < 1 ? old.filter(i => itemKey(i) !== keyOrSlug && i.slug !== keyOrSlug) : old.map(i => (itemKey(i) === keyOrSlug || i.slug === keyOrSlug) ? { ...i, quantity: Math.min(10, quantity) } : i));
  const lines = cart.map(item => {
    const product = (catalog.find(p => p.slug === item.slug) || PRODUCTS.find(p => p.slug === item.slug))!;
    const plan = item.planId ? product.plans?.find(pl => pl.id === item.planId) : undefined;
    const unitPrice = (plan ? plan.prices : product.prices)[currency];
    const displayTitle = plan ? `${title(product)} (${plan.label})` : title(product);
    return { ...item, key: itemKey(item), product, plan, unitPrice, displayTitle };
  });
  const missingPrice = lines.some(line => line.unitPrice === null);
  const precision = currency === 'TND' ? 1000 : 100;
  const subtotalUnits = lines.reduce((sum, line) => sum + Math.round((line.unitPrice || 0) * precision) * line.quantity, 0);
  const totalQty = lines.reduce((sum, line) => sum + line.quantity, 0);
  const code = promoCode.trim().toUpperCase();
  const isReferral = /^ION-[A-Z0-9]{2,10}-[A-F0-9]{4}$/.test(code);
  const baseRates: Record<string, number> = { IONARA10: .1, GAMER10: .1, VIP20: .2, PARRAIN5: .05, COINS10: .1 };
  const bundleRate = code === 'BUNDLE5' && totalQty >= 5 ? .25 : code === 'BUNDLE3' && totalQty >= 3 ? .15 : 0;
  const promoRate = isReferral ? .05 : (baseRates[code] || bundleRate || 0);
  const discountUnits = Math.round(subtotalUnits * promoRate);
  const subtotal = subtotalUnits / precision, discount = discountUnits / precision, total = (subtotalUnits - discountUnits) / precision;
  async function logout() {
    try { await api('/auth/logout', {}); setUser(null); close(); } catch (error) { setToast(errorText(error)); }
  }
  return { locale, setLocale, currency, setCurrency: setCurrencyState, t, formatPrice, title, description, errorText, catalog, refreshCatalog, refreshUser, cart, lines, add, addBundle, updateQuantity, clearCart: () => { setCart([]); setPromoCode(''); }, favorites, toggleFavorite, user, setUser, modal, setModal, product, setProduct, close, toast, setToast, promoCode, setPromoCode, subtotal, discount, total, missingPrice, logout, config, ready };
}
type Shop = ReturnType<typeof useStore>;
const Context = createContext<Shop | null>(null);
export function ShopProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const shop = useStore(locale);
  return <Context.Provider value={shop}>{children}</Context.Provider>;
}
export function useShop() { const shop = useContext(Context); if (!shop) throw new Error('ShopProvider is missing'); return shop; }
