'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CurrencyCode, User } from '@/types';
import { PRODUCTS } from '@/data/products';

interface ShopContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (dzd: number, eur: number, usd: number) => string;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  promoCode: string;
  promoDiscount: number;
  applyPromo: (code: string) => boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  user: User | null;
  token: string | null;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCatalogModalOpen: boolean;
  openCatalogModal: () => void;
  closeCatalogModal: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('DZD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('ionara_cur') as CurrencyCode;
    if (savedCurrency) setCurrencyState(savedCurrency);

    const savedCart = localStorage.getItem('ionara_next_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    const savedToken = localStorage.getItem('ionara_jwt');
    const savedUser = localStorage.getItem('ionara_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('ionara_cur', code);
    showToast(`Devise modifiée en ${code}`, 'info');
  };

  const formatPrice = (dzd: number, eur: number, usd: number) => {
    if (currency === 'EUR') return `${eur} €`;
    if (currency === 'USD') return `$${usd}`;
    return `${dzd.toLocaleString('fr-FR')} DA`;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.slug === product.slug);
      let updated: CartItem[];
      if (idx > -1) {
        updated = [...prev];
        updated[idx].quantity += 1;
      } else {
        updated = [
          ...prev,
          {
            slug: product.slug,
            title: product.title,
            priceDZD: product.priceDZD,
            priceEUR: product.priceEUR,
            priceUSD: product.priceUSD,
            image: product.image,
            platform: product.platform,
            quantity: 1,
          },
        ];
      }
      localStorage.setItem('ionara_next_cart', JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
    showToast(`"${product.title}" ajouté au panier !`, 'success');
  };

  const removeFromCart = (slug: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.slug !== slug);
      localStorage.setItem('ionara_next_cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Article retiré du panier', 'info');
  };

  const updateQuantity = (slug: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((i) => {
          if (i.slug === slug) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];

      localStorage.setItem('ionara_next_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ionara_next_cart');
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'IONARA10' || clean === 'GAMER10') {
      setPromoCode(clean);
      setPromoDiscount(10);
      showToast(`Code ${clean} validé : -10% de réduction !`, 'success');
      return true;
    } else if (clean === 'VIP20') {
      setPromoCode(clean);
      setPromoDiscount(20);
      showToast('Code VIP20 validé : -20% de réduction !', 'success');
      return true;
    } else {
      showToast('Code promo invalide (essayez IONARA10)', 'error');
      return false;
    }
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const p = currency === 'EUR' ? item.priceEUR : currency === 'USD' ? item.priceUSD : item.priceDZD;
    return sum + p * item.quantity;
  }, 0);

  const cartDiscount = cartSubtotal * (promoDiscount / 100);
  const cartTotal = cartSubtotal - cartDiscount;

  const loginUser = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('ionara_user', JSON.stringify(userData));
    localStorage.setItem('ionara_jwt', userToken);
    setIsAuthOpen(false);
    showToast(`Bienvenue, ${userData.username} !`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ionara_user');
    localStorage.removeItem('ionara_jwt');
    showToast('Déconnexion réussie', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        promoCode,
        promoDiscount,
        applyPromo,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        user,
        token,
        loginUser,
        logoutUser,
        isAuthOpen,
        openAuth: () => setIsAuthOpen(true),
        closeAuth: () => setIsAuthOpen(false),
        quickViewProduct,
        openQuickView: (p) => setQuickViewProduct(p),
        closeQuickView: () => setQuickViewProduct(null),
        isCatalogModalOpen,
        openCatalogModal: () => setIsCatalogModalOpen(true),
        closeCatalogModal: () => setIsCatalogModalOpen(false),
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
