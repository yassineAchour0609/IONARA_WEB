export type CurrencyCode = 'TND' | 'EUR' | 'USD';
export interface ProductPlan {
  id: string; label: string; prices: Record<CurrencyCode, number | null>;
}
export interface ProductSpecs {
  os: string; cpu: string; ram: string; gpu: string; storage: string;
}
export interface Product {
  slug: string; title: string; image: string; platform: string;
  category: string; featured: boolean; inStock: boolean; keyGames: string[];
  prices: Record<CurrencyCode, number | null>;
  plans?: ProductPlan[];
  soldCount?: number;
  confirmedSold?: number;
  rating?: number;
  reviewCount?: number;
  accountField?: string;
  trailerUrl?: string;
  specs?: { min: ProductSpecs; rec: ProductSpecs };
}
export interface ProductReview {
  id: string; authorName: string; rating: number; comment: string;
  verifiedPurchase?: boolean; createdAt?: string;
}
export interface CartItem { slug: string; planId?: string; quantity: number; playerAccount?: string; }
export interface User {
  id: string; username: string; email: string; role: string;
  loyaltyPoints?: number; referralCode?: string; referredBy?: string;
}
export interface Order {
  orderNumber: string; currency: CurrencyCode; total: number; status: string; paymentStatus: string;
  paymentMethod?: string; confirmationChannel?: 'whatsapp' | 'instagram'; notes?: string;
  playerAccount?: string; paymentProof?: string;
  isGift?: boolean; giftRecipientName?: string; giftMessage?: string;
  pointsAwarded?: number;
  customer?: { name: string; email: string; phone: string };
  createdAt?: string;
  items: { productId: string; title: string; quantity: number; price: number }[];
}
