'use client';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
export default function NotFound() {
  const { t } = useShop();
  return <section className="container section empty-state"><h1>404</h1><p>{t('NOT_FOUND')}</p><Link className="button primary" href="/">{t('home')}</Link></section>;
}
