'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight, Search, Gamepad2, CreditCard, Coins, Layers3, MessageCircle, Instagram, ShieldCheck, PackagePlus, CheckCircle2, Gift } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useShop } from '@/context/ShopContext';
import { api } from '@/lib/api';
import { ProductCard } from './ProductCard';
import type { MessageKey } from '@/i18n';
import type { Order } from '@/types';

const categories: MessageKey[] = ['all', 'steam', 'preorder', 'nouveautes', 'passes', 'currencies', 'favorites'];
const paymentKeys: MessageKey[] = ['payD17', 'payFlouci', 'payWafacash', 'payIzi', 'payVirement', 'payOoredoo'];

function PaymentStrip() {
  const s = useShop();
  return <section className="container payment-strip" aria-label={s.t('paymentMethodsTitle')}>
    <div className="payment-strip-head"><ShieldCheck size={18} className="accent" /><span>{s.t('paymentMethodsTitle')}</span></div>
    <div className="payment-badges">{paymentKeys.map(k => <span key={k} className="payment-badge">{s.t(k)}</span>)}</div>
  </section>;
}

function BundleBuilder() {
  const s = useShop();
  const [tier, setTier] = useState<3 | 5>(3);
  const [selected, setSelected] = useState<string[]>(['pack-1000-games', 'eafc-26', 'nba-2k26']);
  const eligible = s.catalog.filter(p => p.category === 'steam' || p.category === 'nouveautes');
  const rate = tier === 5 ? 0.25 : 0.15;
  const rawTotal = selected.reduce((sum, slug) => {
    const prod = eligible.find(p => p.slug === slug);
    return sum + (prod?.prices[s.currency] || 0);
  }, 0);
  const discountedTotal = Number((rawTotal * (1 - rate)).toFixed(s.currency === 'TND' ? 3 : 2));

  function toggleGame(slug: string) {
    setSelected(old => {
      if (old.includes(slug)) return old.filter(item => item !== slug);
      if (old.length >= tier) return [...old.slice(1), slug];
      return [...old, slug];
    });
  }

  return <section className="container section">
    <div className="bundle-builder">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent"><PackagePlus size={14} /> FANATICAL / HUMBLE STYLE</p>
          <h2>{s.t('bundleBuilderTitle')}</h2>
          <p className="muted">{s.t('bundleBuilderDesc')}</p>
        </div>
        <div className="button-row">
          <button type="button" className={tier === 3 ? 'button primary' : 'button secondary'} onClick={() => { setTier(3); setSelected(old => old.slice(0, 3)); }}>{s.t('bundleTier3')}</button>
          <button type="button" className={tier === 5 ? 'button primary' : 'button secondary'} onClick={() => setTier(5)}>{s.t('bundleTier5')}</button>
        </div>
      </div>
      <div className="bundle-grid">
        {eligible.map(p => {
          const picked = selected.includes(p.slug);
          return <button type="button" key={p.slug} className={picked ? 'plan-chip active bundle-item' : 'plan-chip bundle-item'} aria-pressed={picked} onClick={() => toggleGame(p.slug)}>
            <div className="bundle-item-row">
              <img src={p.image} alt="" width="44" height="44" />
              <div>
                <span>{s.title(p)}</span>
                <strong>{s.formatPrice(p.prices[s.currency])}</strong>
              </div>
            </div>
          </button>;
        })}
      </div>
      <div className="bundle-footer">
        <div>
          <span className="muted">{selected.length} / {tier} — </span>
          {selected.length === tier ? <>
            <span className="strike-price">{s.formatPrice(rawTotal)}</span>{' '}
            <strong className="accent">{s.formatPrice(discountedTotal)}</strong>
          </> : <span className="muted">{s.t('bundleSelectMore')}</span>}
        </div>
        <button type="button" className="button primary" disabled={selected.length < tier} onClick={() => s.addBundle(selected, tier)}>
          <PackagePlus size={18} />{s.t('bundleAdd')} ({selected.length}/{tier})
        </button>
      </div>
    </div>
  </section>;
}

function HowItWorks() {
  const s = useShop();
  return <section className="container section">
    <div className="section-heading"><div><p className="eyebrow accent">IONARA / {s.t('tunisia')}</p><h2>{s.t('howItWorks')}</h2></div></div>
    <div className="service-grid">
      {([['step1Title', 'step1Desc', Gamepad2], ['step2Title', 'step2Desc', CreditCard], ['step3Title', 'step3Desc', MessageCircle]] as const).map(([titleKey, descKey, Icon]) => (
        <article className="service-card" key={titleKey}><Icon className="accent" /><h3>{s.t(titleKey)}</h3><p>{s.t(descKey)}</p></article>
      ))}
    </div>
  </section>;
}

export function HomePage() {
  const s = useShop();
  return <>
    <section className="hero container">
      <div className="hero-copy"><p className="eyebrow accent"><span className="status-dot" />{s.t('brandTag')}</p><h1>{s.t('heroTitle')}</h1><p className="hero-description">{s.t('heroText')}</p><div className="button-row"><Link href="/catalogue" className="button primary">{s.t('explore')}<ArrowUpRight size={19} /></Link><button className="button secondary" onClick={() => s.setModal('library')}>{s.t('library')}</button></div><div className="hero-tags"><span>Steam</span><span>Xbox</span><span>PlayStation</span><span>Riot Games</span></div></div>
      <div className="hero-art"><div className="hero-glow" /><img className="hero-cover hero-cover-back" src="/assets/games/gta-6.png" alt="Grand Theft Auto VI" width="420" height="420" /><img className="hero-cover hero-cover-front" src="/assets/games/1000-games-pack.png" alt={s.t('packTitle')} width="420" height="420" /><div className="hero-art-label"><Gamepad2 /><span>IONARA COLLECTION<strong>{s.t('tunisia')} / 01</strong></span></div></div>
    </section>
    <PaymentStrip />
    <section className="category-strip container">{([['steam', Layers3], ['nouveautes', Gamepad2], ['passes', CreditCard], ['currencies', Coins]] as const).map(([key, Icon]) => <Link key={key} href={'/catalogue?category=' + key}><Icon size={24} /><span>{s.t(key)}</span><ArrowUpRight size={18} /></Link>)}</section>
    <section className="container section"><div className="section-heading"><div><p className="eyebrow accent">IONARA SELECT</p><h2>{s.t('selection')}</h2></div><Link className="text-link" href="/catalogue">{s.t('seeAll')}<ArrowRight size={17} /></Link></div><div className="product-grid">{s.catalog.filter(p => p.featured).slice(0, 4).map(p => <ProductCard key={p.slug} product={p} />)}</div></section>
    <BundleBuilder />
    <HowItWorks />
    <FAQ />
  </>;
}

export function CatalogPage({ initialCategory = 'all' }: { initialCategory?: string }) {
  const s = useShop();
  const [category, setCategory] = useState(categories.includes(initialCategory as MessageKey) ? initialCategory : 'all');
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('featured');
  const products = s.catalog.filter(p => (category === 'all' || (category === 'favorites' ? s.favorites.includes(p.slug) : p.category === category)) && (platform === 'all' || p.platform === platform) && (s.title(p) + ' ' + p.platform + ' ' + s.description(p)).toLocaleLowerCase(s.locale).includes(search.toLocaleLowerCase(s.locale))).sort((a, b) => {
    if (sort === 'featured') return Number(b.featured) - Number(a.featured);
    const left = a.prices[s.currency], right = b.prices[s.currency];
    if (left === null) return right === null ? 0 : 1;
    if (right === null) return -1;
    return sort === 'priceAsc' ? left - right : right - left;
  });
  return <section className="container section">
    <div className="page-heading"><p className="eyebrow accent">IONARA COLLECTION</p><h1>{s.t('catalogue')}</h1><p>{s.t('catalogText')}</p></div>
    {s.currency === 'TND' && PRODUCTS.some(p => p.prices.TND === null) && <p className="notice">{s.t('priceNotice')}</p>}
    <div className="filters"><label className="search-field"><Search size={19} /><input aria-label={s.t('search')} placeholder={s.t('search')} value={search} onChange={e => setSearch(e.target.value)} /></label><label><span className="sr-only">{s.t('platform')}</span><select aria-label={s.t('platform')} value={platform} onChange={e => setPlatform(e.target.value)}><option value="all">{s.t('allPlatforms')}</option>{[...new Set(s.catalog.map(p => p.platform))].map(p => <option key={p}>{p}</option>)}</select></label><label><span className="sr-only">{s.t('sort')}</span><select aria-label={s.t('sort')} value={sort} onChange={e => setSort(e.target.value)}>{(['featured', 'priceAsc', 'priceDesc'] as const).map(k => <option key={k} value={k}>{s.t(k)}</option>)}</select></label></div>
    <div className="category-tabs" aria-label={s.t('categories')}>{categories.map(key => <button key={key} className={category === key ? 'active' : ''} aria-pressed={category === key} onClick={() => setCategory(key)}>{s.t(key)}{key === 'favorites' && s.favorites.length > 0 ? ` (${s.favorites.length})` : ''}</button>)}</div>
    {products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <div className="empty-state"><Gamepad2 size={44} /><h2>{s.t('noResults')}</h2><button className="button secondary" onClick={() => { setSearch(''); setCategory('all'); setPlatform('all'); }}>{s.t('reset')}</button></div>}
  </section>;
}

function FAQ() {
  const s = useShop();
  return <section className="container section faq"><h2>{s.t('faq')}</h2>{(['Pay', 'Delivery', 'Region', 'SteamOffline', 'Confirmation', 'Support'] as const).map(key => <details key={key}><summary>{s.t(('faq' + key) as MessageKey)}</summary><p>{s.t(('faq' + key + 'Answer') as MessageKey)}</p></details>)}</section>;
}

export function InfoPage({ page }: { page: 'services' | 'about' | 'contact' }) {
  const s = useShop();
  return <><section className="container section info-page"><div className="page-heading"><p className="eyebrow accent">IONARA / {s.t('tunisia')}</p><h1>{s.t((page + 'Title') as MessageKey)}</h1><p>{s.t((page + 'Text') as MessageKey)}</p></div>
    {page === 'contact' ? <div className="contact-panel">
      <a className="button primary" href={s.config.whatsapp ? 'https://wa.me/' + s.config.whatsapp : 'https://wa.me/'} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />{s.t('whatsapp')}<ArrowUpRight size={18} /></a>
      <a className="button secondary" href={s.config.instagram || 'https://www.instagram.com/ionara_shop/'} target="_blank" rel="noopener noreferrer"><Instagram size={18} />{s.t('instagram')}<ArrowUpRight size={18} /></a>
      {s.config.contactEmail && <a className="button secondary" href={'mailto:' + s.config.contactEmail}>{s.config.contactEmail}</a>}
    </div> : <div className="service-grid">{(['steam', 'passes', 'currencies'] as const).map(key => <article className="service-card" key={key}><Gamepad2 className="accent" /><h2>{s.t(key)}</h2><p>{s.t((key + 'Desc') as MessageKey)}</p><Link className="text-link" href={'/catalogue?category=' + key}>{s.t('explore')}<ArrowUpRight size={18} /></Link></article>)}</div>}
  </section><PaymentStrip /><FAQ /></>;
}

export function LegalPage() {
  const s = useShop();
  const sections = ['Cgv', 'Pay', 'Delivery', 'Warranty', 'Privacy', 'Rights', 'Sourcing'] as const;
  return <>
    <section className="container section info-page">
      <div className="page-heading">
        <p className="eyebrow accent">IONARA / {s.t('tunisia')}</p>
        <h1>{s.t('legalTitle')}</h1>
        <p>{s.t('legalIntro')}</p>
      </div>
      <div className="form-stack">
        {sections.map(k => <article className="service-card" key={k}><h2>{s.t(('legal' + k + 'Title') as MessageKey)}</h2><p>{s.t(('legal' + k + 'Text') as MessageKey)}</p></article>)}
      </div>
    </section>
    <PaymentStrip />
  </>;
}

export function AdminPage() {
  const s = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!s.user) return;
    api<{ orders: Order[] }>('/orders?scope=all').then(d => setOrders(d.orders || [])).catch(() => {});
  }, [s.user]);

  async function updateOrder(orderNumber: string, patch: { status?: string; paymentStatus?: string }) {
    setBusyId(orderNumber);
    try {
      const res = await api<{ order: Order }>('/orders/' + encodeURIComponent(orderNumber), patch, 'PATCH');
      setOrders(old => old.map(o => o.orderNumber === orderNumber ? res.order : o));
      s.refreshCatalog();
      s.refreshUser();
      s.setToast(s.t('orderSuccess'));
    } catch (err) {
      s.setToast(s.errorText(err));
    } finally {
      setBusyId('');
    }
  }

  const visibleOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);
  const pendingCount = orders.filter(o => o.status === 'pending_confirmation').length;
  const confirmedCount = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'delivered').length;
  const revenueTnd = orders
    .filter(o => (o.paymentStatus === 'paid' || o.status === 'delivered') && o.currency === 'TND')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return <section className="container section info-page">
    <div className="page-heading">
      <p className="eyebrow accent">IONARA BACKOFFICE / {s.t('tunisia')}</p>
      <h1>{s.t('adminTitle')}</h1>
      <p>{s.t('adminDesc')}</p>
    </div>
    {!s.user ? (
      <div className="empty-state">
        <p>{s.t('signInRequired')}</p>
        <button className="button primary" onClick={() => s.setModal('auth')}>{s.t('login')}</button>
      </div>
    ) : (
      <>
        <div className="admin-kpis">
          <div className="service-card"><span>{s.t('adminTotalOrders')}</span><h2>{orders.length}</h2></div>
          <div className="service-card"><span>{s.t('adminPending')}</span><h2>{pendingCount}</h2></div>
          <div className="service-card"><span>{s.t('adminDelivered')}</span><h2>{confirmedCount}</h2></div>
          <div className="service-card"><span>{s.t('adminRevenue')}</span><h2>{s.formatPrice(revenueTnd, 'TND')}</h2></div>
        </div>
        <div className="category-tabs">
          {(['all', 'pending_confirmation', 'processing', 'delivered', 'cancelled'] as const).map(st => (
            <button key={st} className={statusFilter === st ? 'active' : ''} onClick={() => setStatusFilter(st)}>
              {st === 'all' ? s.t('all') : s.t(('status_' + st) as MessageKey)}
            </button>
          ))}
        </div>
        <div className="form-stack">
          {visibleOrders.map(ord => {
            const clientWa = ord.customer?.phone ? 'https://wa.me/' + ord.customer.phone.replace(/^\+/, '') + '?text=' + encodeURIComponent(`Bonjour ${ord.customer.name}, concernant votre commande IONARA ${ord.orderNumber} :`) : '';
            return <article key={ord.orderNumber} className="service-card admin-order-card">
              <div className="section-heading">
                <div>
                  <strong className="order-reference" dir="ltr">{ord.orderNumber}</strong>
                  <p className="muted">{ord.customer?.name} · <span dir="ltr">{ord.customer?.phone}</span> · {ord.customer?.email}</p>
                </div>
                <div className="product-social-row">
                  <span className={ord.paymentStatus === 'paid' ? 'stock-pill' : 'sold-pill'}>{ord.paymentStatus === 'paid' ? '✓ PAID' : 'UNPAID'}</span>
                  <span className="payment-badge">{s.t(('status_' + ord.status) as MessageKey)}</span>
                </div>
              </div>
              <ul>{ord.items.map(i => <li key={i.productId}>{i.title} × {i.quantity} ({s.formatPrice(i.price, ord.currency)})</li>)}</ul>
              <div className="admin-meta-grid">
                <span><strong>{s.t('paymentMethod')}:</strong> {ord.paymentMethod}</span>
                <span><strong>{s.t('total')}:</strong> {s.formatPrice(ord.total, ord.currency)}</span>
                {ord.playerAccount && <span><strong>{s.t('playerFieldLabel')}:</strong> {ord.playerAccount}</span>}
                {ord.paymentProof && <span><strong>{s.t('paymentProofLabel')}:</strong> {ord.paymentProof}</span>}
                {ord.isGift && <span><Gift size={14} /> <strong>Cadeau:</strong> {ord.giftRecipientName} {ord.giftMessage ? `("${ord.giftMessage}")` : ''}</span>}
                {ord.notes && <span><strong>Note:</strong> {ord.notes}</span>}
              </div>
              <div className="button-row">
                {s.user?.role === 'admin' && <>
                  <button type="button" className="button primary" disabled={busyId === ord.orderNumber} onClick={() => updateOrder(ord.orderNumber, { paymentStatus: 'paid', status: 'processing' })}><CheckCircle2 size={16} />{s.t('adminMarkPaid')}</button>
                  <button type="button" className="button secondary" disabled={busyId === ord.orderNumber} onClick={() => updateOrder(ord.orderNumber, { paymentStatus: 'paid', status: 'delivered' })}>{s.t('adminMarkDelivered')}</button>
                  <button type="button" className="button secondary" disabled={busyId === ord.orderNumber} onClick={() => updateOrder(ord.orderNumber, { status: 'processing' })}>{s.t('adminMarkProcessing')}</button>
                  <button type="button" className="button secondary" disabled={busyId === ord.orderNumber} onClick={() => updateOrder(ord.orderNumber, { status: 'cancelled' })}>{s.t('adminMarkCancelled')}</button>
                </>}
                {clientWa && <a className="button secondary" href={clientWa} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />WhatsApp Client</a>}
              </div>
            </article>;
          })}
          {!visibleOrders.length && <div className="empty-state"><p>{s.t('noResults')}</p></div>}
        </div>
      </>
    )}
  </section>;
}
