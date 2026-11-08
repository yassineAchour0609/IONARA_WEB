export type CurrencyCode = 'DZD' | 'EUR' | 'USD';

export interface Product {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  platform: string;
  platformIcon?: string;
  category: 'steam' | 'preorder' | 'nouveautes' | 'passes' | 'currencies' | 'all';
  isFeatured?: boolean;
  badge: string;
  tag: string;
  priceDZD: number;
  oldPriceDZD: number;
  priceEUR: number;
  oldPriceEUR: number;
  priceUSD: number;
  oldPriceUSD: number;
  rating: number;
  reviewsCount: number;
  delivery: string;
  guarantee: string;
  description: string;
  features: string[];
  keyGames?: string[];
  inStock?: boolean;
}

export interface CartItem {
  slug: string;
  title: string;
  priceDZD: number;
  priceEUR: number;
  priceUSD: number;
  image: string;
  platform: string;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
}

export interface GameCatalogItem {
  id: number;
  title: string;
}
