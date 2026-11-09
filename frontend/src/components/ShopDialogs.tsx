'use client';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { Minus, Plus, Trash2, CheckCircle2, Search, Copy, MessageCircle, Instagram, Star, Gift, Cpu, PlayCircle, Coins, Receipt } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { api } from '@/lib/api';
import type { MessageKey } from '@/i18n';
import type { Order, Product, ProductReview, User } from '@/types';
import Dialog from './Dialog';

const PAY_LABEL_KEYS: Record<string, MessageKey> = {
  d17: 'payD17',
  flouci: 'payFlouci',
  wafacash: 'payWafacash',
  isizitounapayment: 'payIzi',
  izi: 'payIzi',
  virmentbancaire: 'payVirement',
  virement: 'payVirement',
  'solde ooredoo': 'payOoredoo',
  solde_ooredoo: 'payOoredoo',
  ooredoo: 'payOoredoo',
  manual: 'payManual',
};

function playerFieldKeyFor(accountField?: string): MessageKey {
  const key = 'playerField_' + (accountField || 'steamOffline');
  if (['playerField_riotId', 'playerField_microsoftEmail', 'playerField_consoleId', 'playerField_eaId', 'playerField_steamOffline', 'playerField_giftRecipient'].includes(key)) {
    return key as MessageKey;
  }
  return 'playerFieldLabel';
}

function Auth() {
  const s = useShop();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await api<{ user: User }>(register ? '/auth/register' : '/auth/login', data);
      s.setUser(result.user); s.close();
    } catch (err) { setError(s.errorText(err)); } finally { setBusy(false); }
  }
  return <Dialog title={s.t(register ? 'register' : 'login')} onClose={() => { if (!busy) s.close(); }}><form className="form-stack" onSubmit={submit}>
    {register && <label>{s.t('username')}<input name="username" required minLength={3} maxLength={60} autoComplete="username" /></label>}
    <label>{s.t('email')}<input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" /></label>
    <div><label>{s.t('password')}<input name="password" type="password" required minLength={8} maxLength={72} aria-describedby="password-hint" autoComplete={register ? 'new-password' : 'current-password'} /></label><small id="password-hint">{s.t('passwordHint')}</small></div>
    {register && <label>{s.t('referredByLabel')}<input name="referredBy" maxLength={24} placeholder="ION-…" dir="ltr" /></label>}
    {error && <p role="alert" className="error">{error}</p>}
    <button disabled={busy} className="button primary" type="submit">{s.t(busy ? 'working' : register ? 'register' : 'login')}</button>
    <button type="button" disabled={busy} className="text-link" onClick={() => { setRegister(!register); setError(''); }}>{s.t(register ? 'login' : 'register')}</button>
  </form></Dialog>;
}

function Totals() {
  const s = useShop();
  return <div className="totals"><div><span>{s.t('subtotal')}</span><span>{s.formatPrice(s.missingPrice ? null : s.subtotal)}</span></div>{s.discount > 0 && <div><span>{s.t('discount')}</span><span>−{s.formatPrice(s.missingPrice ? null : s.discount)}</span></div>}<div className="total"><strong>{s.t('total')}</strong><strong>{s.formatPrice(s.missingPrice ? null : s.total)}</strong></div></div>;
}

function Cart() {
  const s = useShop();
  const [promo, setPromo] = useState(s.promoCode);
  function apply(event: FormEvent) {
    event.preventDefault();
    const code = promo.trim().toUpperCase();
    const isRef = /^ION-[A-Z0-9]{2,10}-[A-F0-9]{4}$/.test(code);
    if (!code || ['IONARA10', 'GAMER10', 'VIP20', 'PARRAIN5', 'COINS10', 'BUNDLE3', 'BUNDLE5'].includes(code) || isRef) {
      s.setPromoCode(code);
      if (code) s.setToast(s.t('promoApplied'));
    } else s.setToast(s.t('INVALID_PROMO'));
  }
  return <Dialog title={s.t('cart')} onClose={s.close}>{!s.lines.length ? <div className="empty-state"><p>{s.t('emptyCart')}</p><button className="button primary" onClick={s.close}>{s.t('continue')}</button></div> : <>
    <div className="cart-lines">{s.lines.map(line => <div className="cart-line" key={line.key}><img src={line.product.image} alt="" width="72" height="72" /><div className="cart-line-info"><h3>{line.displayTitle}</h3><p>{s.formatPrice(line.unitPrice)}{line.playerAccount ? ` · ${line.playerAccount}` : ''}</p><div className="quantity-control"><button className="icon-button" aria-label={s.t('quantity') + ' −: ' + line.displayTitle} onClick={() => s.updateQuantity(line.key, line.quantity - 1)}><Minus size={14} /></button><span>{line.quantity}</span><button className="icon-button" disabled={line.quantity >= 10} aria-label={s.t('quantity') + ' +: ' + line.displayTitle} onClick={() => s.updateQuantity(line.key, line.quantity + 1)}><Plus size={14} /></button></div></div><button className="icon-button" aria-label={s.t('remove') + ': ' + line.displayTitle} onClick={() => s.updateQuantity(line.key, 0)}><Trash2 size={17} /></button></div>)}</div>
    <form className="promo-form" onSubmit={apply}><input aria-label={s.t('promo')} placeholder={s.t('promo')} value={promo} onChange={e => setPromo(e.target.value)} /><button className="button secondary">{s.t('apply')}</button></form><Totals />
    {s.missingPrice && <p className="notice">{s.t('PRICE_UNAVAILABLE')}</p>}
    <button className="button primary full-width" disabled={s.missingPrice} onClick={() => s.setModal(s.user ? 'checkout' : 'auth')}>{s.t(s.user ? 'checkout' : 'login')}</button>
    {!s.user && <p className="muted">{s.t('signInRequired')}</p>}
  </>}</Dialog>;
}

function DeliveryTrackerSteps({ order }: { order: Order }) {
  const s = useShop();
  const isPaid = order.paymentStatus === 'paid' || order.status === 'processing' || order.status === 'delivered';
  const isProcessing = order.status === 'processing' || order.status === 'delivered';
  const isDelivered = order.status === 'delivered';
  const steps: [MessageKey, boolean][] = [
    ['stepOrderPlaced', true],
    ['stepPaymentVerified', isPaid],
    ['stepProcessing', isProcessing],
    ['stepDelivered', isDelivered],
  ];
  return <div className="tracker-steps" aria-label={s.t('trackOrderTitle')}>
    {steps.map(([key, done]) => (
      <div key={key} className={done ? 'tracker-step active' : 'tracker-step'}>
        <span className="tracker-dot" />
        <span>{s.t(key)}</span>
      </div>
    ))}
  </div>;
}

function SavedOrder({ order: initialOrder, guestPhone }: { order: Order; guestPhone?: string }) {
  const s = useShop();
  const [order, setOrder] = useState(initialOrder);
  const [proof, setProof] = useState(initialOrder.paymentProof || '');
  const [savingProof, setSavingProof] = useState(false);
  const payLabel = order.paymentMethod && PAY_LABEL_KEYS[order.paymentMethod] ? s.t(PAY_LABEL_KEYS[order.paymentMethod]) : s.t('payD17');
  const message = [
    'IONARA TUNISIA — ' + s.t('reference') + ': ' + order.orderNumber,
    ...order.items.map(i => '• ' + i.title + ' × ' + i.quantity),
    s.t('paymentMethod') + ': ' + payLabel,
    ...(order.playerAccount ? [s.t('playerFieldLabel') + ': ' + order.playerAccount] : []),
    ...(order.paymentProof ? [s.t('paymentProofLabel') + ': ' + order.paymentProof] : []),
    ...(order.isGift && order.giftRecipientName ? ['🎁 ' + s.t('giftRecipientLabel') + ': ' + order.giftRecipientName] : []),
    ...(order.notes ? [s.t('orderNotes') + ': ' + order.notes] : []),
    s.t('total') + ': ' + s.formatPrice(order.total, order.currency),
  ].join('\n');
  function copySummary() {
    try { navigator.clipboard?.writeText(message); } catch {}
    s.setToast(s.t('orderCopied'));
  }
  async function savePaymentProof(e: FormEvent) {
    e.preventDefault();
    if (!proof.trim()) return;
    setSavingProof(true);
    try {
      const updated = guestPhone
        ? await api<{ order: Order }>('/orders/track/proof', { orderNumber: order.orderNumber, phone: guestPhone, paymentProof: proof.trim() })
        : await api<{ order: Order }>('/orders/' + encodeURIComponent(order.orderNumber) + '/proof', { paymentProof: proof.trim() }, 'PATCH');
      setOrder(updated.order);
      s.setToast(s.t('paymentProofSaved'));
    } catch (err) {
      s.setToast(s.errorText(err));
    } finally {
      setSavingProof(false);
    }
  }
  const waHref = (s.config.whatsapp ? 'https://wa.me/' + s.config.whatsapp : 'https://wa.me/') + '?text=' + encodeURIComponent(message);
  return <div className="saved-order">
    <CheckCircle2 size={40} className="accent" />
    <p>{s.t('orderSaved')}</p>
    <p><strong>{s.t('reference')}</strong><br /><span className="order-reference" dir="ltr">{order.orderNumber}</span></p>
    <DeliveryTrackerSteps order={order} />
    <ul>{order.items.map(i => <li key={i.productId}>{i.title} × {i.quantity}</li>)}</ul>
    <p className="muted">{s.t('paymentMethod')}: <strong>{payLabel}</strong></p>
    {order.playerAccount && <p className="muted">{s.t('playerFieldLabel')}: <strong>{order.playerAccount}</strong></p>}
    {order.isGift && <div className="gift-voucher">
      <div className="gift-voucher-head"><Gift size={18} className="accent" /><strong>{s.t('giftVoucherBadge')}</strong></div>
      {order.giftRecipientName && <p><strong>{s.t('giftRecipientLabel')}:</strong> {order.giftRecipientName}</p>}
      {order.giftMessage && <p>« {order.giftMessage} »</p>}
    </div>}
    <p className="notice">{order.paymentStatus === 'paid' ? s.t(('status_' + order.status) as MessageKey) : s.t('pending')}</p>
    <strong>{s.formatPrice(order.total, order.currency)}</strong>
    <form className="promo-form" onSubmit={savePaymentProof}>
      <input aria-label={s.t('paymentProofLabel')} placeholder={s.t('paymentProofHint')} value={proof} maxLength={200} onChange={e => setProof(e.target.value)} />
      <button className="button secondary" disabled={savingProof}>{s.t('saveProof')}</button>
    </form>
    <div className="button-row">
      <a className="button primary" href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />{s.t('whatsapp')}</a>
      <a className="button secondary" href={s.config.instagram || 'https://www.instagram.com/ionara_shop/'} target="_blank" rel="noopener noreferrer" onClick={copySummary}><Instagram size={18} />{s.t('instagram')}</a>
      <button type="button" className="button secondary" onClick={copySummary}><Copy size={17} />{s.t('copyOrder')}</button>
    </div>
    <button className="button secondary" onClick={s.close}>{s.t('continue')}</button>
  </div>;
}

function Checkout() {
  const s = useShop();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isGift, setIsGift] = useState(false);
  const defaultPlayerAccount = s.lines.map(l => l.playerAccount).filter(Boolean).join(' | ');
  const primaryAccountField = s.lines[0]?.product?.accountField;
  const playerFieldLabel = s.t(playerFieldKeyFor(primaryAccountField));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!s.user || s.missingPrice || !s.cart.length) return;
    setBusy(true); setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      customer: { name: data.name, phone: data.phone },
      items: s.cart.map(i => ({ slug: i.slug, ...(i.planId ? { planId: i.planId } : {}), quantity: i.quantity })),
      currency: s.currency,
      promoCode: s.promoCode,
      paymentMethod: String(data.paymentMethod || 'd17'),
      confirmationChannel: data.confirmationChannel === 'instagram' ? 'instagram' : 'whatsapp',
      playerAccount: String(data.playerAccount || '').trim(),
      paymentProof: String(data.paymentProof || '').trim(),
      isGift,
      giftRecipientName: isGift ? String(data.giftRecipientName || '').trim() : '',
      giftMessage: isGift ? String(data.giftMessage || '').trim() : '',
      notes: String(data.notes || '').trim(),
      locale: s.locale,
    };
    const fingerprint = JSON.stringify({ user: s.user.id, ...body });
    let requestId = crypto.randomUUID();
    try {
      const previous = JSON.parse(sessionStorage.getItem('ionara_order_attempt') || 'null');
      if (previous?.fingerprint === fingerprint && typeof previous.requestId === 'string') requestId = previous.requestId;
      sessionStorage.setItem('ionara_order_attempt', JSON.stringify({ fingerprint, requestId }));
    } catch { /* Requests still have an id when storage is unavailable. */ }
    try {
      const result = await api<{ order: Order }>('/orders', { ...body, requestId });
      setOrder(result.order); s.clearCart();
      try { sessionStorage.removeItem('ionara_order_attempt'); } catch {}
    } catch (err) { setError(s.errorText(err)); } finally { setBusy(false); }
  }
  return <Dialog title={s.t(order ? 'orderSuccess' : 'checkoutTitle')} onClose={() => { if (!busy) s.close(); }}>{order ? <SavedOrder order={order} /> : <form className="form-stack" onSubmit={submit}>
    <label>{s.t('name')}<input name="name" required minLength={2} maxLength={100} autoComplete="name" defaultValue={s.user?.username} /></label>
    <label>{s.t('email')}<input type="email" value={s.user?.email || ''} readOnly dir="ltr" /></label>
    <div><label>{s.t('phone')}<input name="phone" type="tel" autoComplete="tel" placeholder="+216 XX XXX XXX" required maxLength={24} aria-describedby="phone-hint" dir="ltr" /></label><small id="phone-hint">{s.t('phoneHint')}</small></div>
    <label>{playerFieldLabel}<input name="playerAccount" maxLength={160} defaultValue={defaultPlayerAccount} placeholder={playerFieldLabel} /></label>
    <label>{s.t('paymentMethod')}<select name="paymentMethod" defaultValue="d17">
      <option value="d17">{s.t('payD17')}</option>
      <option value="flouci">{s.t('payFlouci')}</option>
      <option value="wafacash">{s.t('payWafacash')}</option>
      <option value="isizitounapayment">{s.t('payIzi')}</option>
      <option value="virmentbancaire">{s.t('payVirement')}</option>
      <option value="solde ooredoo">{s.t('payOoredoo')}</option>
    </select></label>
    <div><label>{s.t('paymentProofLabel')}<input name="paymentProof" maxLength={200} placeholder={s.t('paymentProofHint')} /></label><small>{s.t('paymentProofHint')}</small></div>
    <label>{s.t('confirmationChannel')}<select name="confirmationChannel" defaultValue="whatsapp">
      <option value="whatsapp">{s.t('channelWhatsapp')}</option>
      <option value="instagram">{s.t('channelInstagram')}</option>
    </select></label>
    <button type="button" className={isGift ? 'plan-chip active' : 'plan-chip'} aria-pressed={isGift} onClick={() => setIsGift(!isGift)}>
      <span className="gift-toggle-row"><Gift size={16} />{s.t('buyAsGift')}</span>
    </button>
    {isGift && <div className="form-stack notice">
      <label>{s.t('giftRecipientLabel')}<input name="giftRecipientName" maxLength={100} placeholder="Ex: Yassine" /></label>
      <label>{s.t('giftMessageLabel')}<input name="giftMessage" maxLength={240} placeholder="Bon jeu ! Joyeux anniversaire 🎮" /></label>
    </div>}
    <div><label>{s.t('orderNotes')}<input name="notes" maxLength={300} placeholder={s.t('orderNotesHint')} aria-describedby="notes-hint" /></label><small id="notes-hint">{s.t('orderNotesHint')}</small></div>
    <div className="notice"><strong>{s.t('manual')}</strong><p>{s.t('manualInfo')}</p></div><Totals />
    <label className="terms-check"><input type="checkbox" name="acceptTerms" required /><span>{s.t('acceptTerms')}</span></label>
    <details className="checkout-legal">
      <summary className="text-link">{s.t('legalLink')}</summary>
      <div className="form-stack">
        {(['Cgv', 'Pay', 'Delivery', 'Warranty', 'Privacy', 'Rights', 'Sourcing'] as const).map(k => <div className="notice" key={k}><strong>{s.t(('legal' + k + 'Title') as MessageKey)}</strong><p>{s.t(('legal' + k + 'Text') as MessageKey)}</p></div>)}
      </div>
    </details>
    {error && <p role="alert" className="error">{error}</p>}
    <button className="button primary" disabled={busy || s.missingPrice || !s.cart.length}>{s.t(busy ? 'working' : 'submitOrder')}</button>
  </form>}</Dialog>;
}

function Library() {
  const s = useShop();
  const [games, setGames] = useState<{ id: number; title: string }[]>([]);
  const [search, setSearch] = useState(''), [limit, setLimit] = useState(60), [error, setError] = useState(false);
  useEffect(() => { const controller = new AbortController(); fetch('/assets/games_list.json', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(setGames).catch(() => { if (!controller.signal.aborted) setError(true); }); return () => controller.abort(); }, []);
  const filtered = games.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
  return <Dialog title={s.t('library')} onClose={s.close}><p className="muted">{s.t('libraryText')}</p><label className="search-field"><Search size={18} /><input aria-label={s.t('search')} placeholder={s.t('search')} value={search} onChange={e => { setSearch(e.target.value); setLimit(60); }} /></label>{error ? <p role="alert" className="error">{s.t('SERVICE_UNAVAILABLE')}</p> : <><p className="muted">{filtered.length}</p><ul className="games-list">{filtered.slice(0, limit).map(g => <li key={g.id}>{g.title}</li>)}</ul>{!filtered.length && <p>{s.t(games.length ? 'noResults' : 'working')}</p>}{filtered.length > limit && <button className="button secondary" onClick={() => setLimit(limit + 60)}>{s.t('showMore')}</button>}</>}</Dialog>;
}

function Account() {
  const s = useShop();
  const [order, setOrder] = useState<Order | null>(null), [recent, setRecent] = useState<Order[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    s.refreshUser();
    api<{ orders: Order[] }>('/orders').then(d => setRecent(d.orders || [])).catch(() => {});
  }, [s.refreshUser]);
  async function find(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setOrder(null);
    const ref = new FormData(event.currentTarget).get('reference');
    try { const data = await api<{ order: Order }>('/orders/' + encodeURIComponent(String(ref).trim())); setOrder(data.order); }
    catch (err) { setError(s.errorText(err)); } finally { setBusy(false); }
  }
  function copyRefCode() {
    if (!s.user?.referralCode) return;
    try { navigator.clipboard?.writeText(s.user.referralCode); } catch {}
    s.setToast(s.t('referralCopied'));
  }
  return <Dialog title={s.t('account')} onClose={s.close}>
    <p>{s.user?.username} · {s.user?.email}</p>
    <div className="loyalty-card">
      <div className="loyalty-head">
        <div>
          <span className="eyebrow accent"><Coins size={14} /> {s.t('loyaltyTitle')}</span>
          <h3>{s.user?.loyaltyPoints ?? 25} IONARA Coins</h3>
        </div>
        {s.user?.referralCode && <button type="button" className="button secondary" onClick={copyRefCode}><Copy size={15} />{s.user.referralCode}</button>}
      </div>
      <p className="muted">{s.t('loyaltyHint')}</p>
    </div>
    {s.user?.role === 'admin' && <Link href="/admin" className="button primary full-width" onClick={s.close}>{s.t('adminNav')}</Link>}
    <form className="form-stack" onSubmit={find}><label>{s.t('orderNumber')}<input name="reference" required dir="ltr" placeholder="ION-…" /></label><button className="button secondary" disabled={busy}>{s.t(busy ? 'working' : 'track')}</button></form>
    {error && <p className="error" role="alert">{error}</p>}
    {order && <SavedOrder order={order} />}
    {recent.length > 0 && !order && <div className="plan-selector"><h3>{s.t('myOrders')}</h3><div className="form-stack">{recent.slice(0, 5).map(o => <button type="button" key={o.orderNumber} className="plan-chip" onClick={() => setOrder(o)}><span dir="ltr">{o.orderNumber}</span><strong>{s.formatPrice(o.total, o.currency)} · {s.t(('status_' + o.status) as MessageKey)}{o.paymentProof ? ' · ✓ Reçu' : ''}</strong></button>)}</div></div>}
    <button className="text-link" onClick={s.logout}>{s.t('logout')}</button>
  </Dialog>;
}

function TrackOrder() {
  const s = useShop();
  const [order, setOrder] = useState<Order | null>(null);
  const [guestPhone, setGuestPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(''); setOrder(null);
    const fd = new FormData(e.currentTarget);
    const ref = String(fd.get('orderNumber') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    setGuestPhone(phone);
    try {
      const res = await api<{ order: Order }>('/orders/track?orderNumber=' + encodeURIComponent(ref) + '&phone=' + encodeURIComponent(phone));
      setOrder(res.order);
    } catch (err) {
      setError(s.errorText(err));
    } finally {
      setBusy(false);
    }
  }
  return <Dialog title={s.t('trackOrderTitle')} onClose={s.close}>
    <p className="muted">{s.t('trackOrderDesc')}</p>
    <form className="form-stack" onSubmit={submit}>
      <label>{s.t('orderNumber')}<input name="orderNumber" required dir="ltr" placeholder="ION-…" /></label>
      <label>{s.t('phone')}<input name="phone" type="tel" required dir="ltr" placeholder="+216 XX XXX XXX" /></label>
      <button className="button primary" disabled={busy}>{s.t(busy ? 'working' : 'find')}</button>
    </form>
    {error && <p className="error" role="alert">{error}</p>}
    {order && <SavedOrder order={order} guestPhone={guestPhone} />}
  </Dialog>;
}

function Legal() {
  const s = useShop();
  const sections = ['Cgv', 'Pay', 'Delivery', 'Warranty', 'Privacy', 'Rights', 'Sourcing'] as const;
  return <Dialog title={s.t('legalTitle')} onClose={s.close}>
    <div className="form-stack">
      <p className="muted">{s.t('legalIntro')}</p>
      {sections.map(k => <div className="notice" key={k}><strong>{s.t(('legal' + k + 'Title') as MessageKey)}</strong><p>{s.t(('legal' + k + 'Text') as MessageKey)}</p></div>)}
      <button type="button" className="button secondary" onClick={s.close}>{s.t('continue')}</button>
    </div>
  </Dialog>;
}

function ProductModal({ p }: { p: Product }) {
  const s = useShop();
  const live = s.catalog.find(item => item.slug === p.slug) || p;
  const [planId, setPlanId] = useState(live.plans?.[0]?.id || '');
  const [playerAccount, setPlayerAccount] = useState('');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentVal, setCommentVal] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const activePlan = live.plans?.find(pl => pl.id === planId);
  const activePrice = (activePlan ? activePlan.prices : live.prices)[s.currency];
  const fieldLabel = s.t(playerFieldKeyFor(live.accountField));

  useEffect(() => {
    api<{ reviews: ProductReview[] }>('/products/' + encodeURIComponent(live.slug) + '/reviews')
      .then(d => setReviews(d.reviews || []))
      .catch(() => {});
  }, [live.slug]);

  async function submitReview(e: FormEvent) {
    e.preventDefault();
    if (!s.user) { s.setProduct(null); s.setModal('auth'); return; }
    if (commentVal.trim().length < 3) return;
    setSubmittingReview(true);
    try {
      const res = await api<{ review: ProductReview }>('/products/' + encodeURIComponent(live.slug) + '/reviews', { rating: ratingVal, comment: commentVal.trim() });
      setReviews(old => [res.review, ...old]);
      setCommentVal('');
      s.refreshCatalog();
      s.setToast(s.t('reviewAdded'));
    } catch (err) {
      s.setToast(s.errorText(err));
    } finally {
      setSubmittingReview(false);
    }
  }

  return <Dialog title={s.title(live)} onClose={s.close}>
    <img className="detail-image" src={live.image} alt={s.title(live)} width="600" height="600" />
    <div className="detail-meta">
      <p className="eyebrow accent">{live.platform}</p>
      <div className="product-social-row">
        <span className="rating-pill"><Star size={13} fill="currentColor" />{(live.rating ?? 4.9).toFixed(1)} ({live.reviewCount ?? reviews.length})</span>
        <span className="sold-pill">{live.soldCount ?? 50} {s.t('soldBadge')}</span>
        {live.inStock && <span className="stock-pill"><span className="stock-dot" />{s.t('inStockBadge')}</span>}
      </div>
    </div>
    <p>{s.description(live)}</p>
    {live.trailerUrl && <a className="button secondary full-width" href={live.trailerUrl} target="_blank" rel="noopener noreferrer"><PlayCircle size={18} />{s.t('watchTrailer')}</a>}
    {live.plans && live.plans.length > 0 && <div className="plan-selector">
      <h3>{s.t('selectPlan')}</h3>
      <div className="plan-grid">
        {live.plans.map(pl => <button type="button" key={pl.id} className={pl.id === planId ? 'plan-chip active' : 'plan-chip'} aria-pressed={pl.id === planId} onClick={() => setPlanId(pl.id)}>
          <span>{pl.label}</span>
          <strong>{s.formatPrice(pl.prices[s.currency])}</strong>
        </button>)}
      </div>
    </div>}
    <div className="plan-selector">
      <label className="form-stack">
        <span>{fieldLabel}</span>
        <input value={playerAccount} maxLength={160} onChange={e => setPlayerAccount(e.target.value)} placeholder={fieldLabel} />
      </label>
    </div>
    {live.keyGames.length > 0 && !live.plans?.length && <><h3>{s.t('included')}</h3><ul>{live.keyGames.map(g => <li key={g}>{g}</li>)}</ul></>}
    <div className="section-heading">
      <strong>{s.formatPrice(activePrice)}</strong>
      <button className="button primary" disabled={!live.inStock} onClick={() => s.add(live, activePlan?.id, playerAccount)}>{s.t('add')}</button>
    </div>
    {live.slug === 'pack-1000-games' && <button className="text-link" onClick={() => { s.setProduct(null); s.setModal('library'); }}>{s.t('library')}</button>}
    {live.specs && <div className="specs-section">
      <h3><Cpu size={16} className="accent" /> {s.t('specsTitle')}</h3>
      <div className="specs-grid">
        {(['min', 'rec'] as const).map(tier => (
          <div key={tier} className="specs-card">
            <strong>{s.t(tier === 'min' ? 'specsMin' : 'specsRec')}</strong>
            <ul>
              <li><span>OS:</span> {live.specs![tier].os}</li>
              <li><span>CPU:</span> {live.specs![tier].cpu}</li>
              <li><span>RAM:</span> {live.specs![tier].ram}</li>
              <li><span>GPU:</span> {live.specs![tier].gpu}</li>
              <li><span>SSD:</span> {live.specs![tier].storage}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>}
    <div className="reviews-section">
      <h3>{s.t('reviewsTitle')} ({reviews.length})</h3>
      <div className="reviews-list">
        {reviews.slice(0, 6).map(rev => (
          <div key={rev.id} className="review-card">
            <div className="review-head">
              <strong>{rev.authorName}</strong>
              {rev.verifiedPurchase && <span className="stock-pill">✓ {s.t('verifiedBuyer')}</span>}
              <span className="rating-pill">{'★'.repeat(rev.rating)}</span>
            </div>
            <p>{rev.comment}</p>
          </div>
        ))}
      </div>
      <form className="form-stack review-form" onSubmit={submitReview}>
        <h4>{s.t('writeReview')}</h4>
        <label>{s.t('yourRating')}
          <select value={ratingVal} onChange={e => setRatingVal(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>)}
          </select>
        </label>
        <label>{s.t('yourComment')}
          <input value={commentVal} onChange={e => setCommentVal(e.target.value)} minLength={3} maxLength={500} placeholder={s.t('yourComment')} required />
        </label>
        <button className="button secondary" disabled={submittingReview}>{s.t('submitReview')}</button>
      </form>
    </div>
  </Dialog>;
}

export default function ShopDialogs() {
  const s = useShop();
  if (s.product) return <ProductModal key={s.product.slug} p={s.product} />;
  if (s.modal === 'auth') return <Auth />;
  if (s.modal === 'cart') return <Cart />;
  if (s.modal === 'checkout') return <Checkout />;
  if (s.modal === 'library') return <Library />;
  if (s.modal === 'account') return <Account />;
  if (s.modal === 'track') return <TrackOrder />;
  if (s.modal === 'legal') return <Legal />;
  return null;
}
