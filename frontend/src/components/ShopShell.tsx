'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Globe2, Gamepad2, MessageCircle, Instagram, ShieldAlert } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useShop } from '@/context/ShopContext';
import type { Locale, MessageKey } from '@/i18n';
import type { CurrencyCode } from '@/types';
import ShopDialogs from './ShopDialogs';
const links: [string, MessageKey][] = [['/', 'home'], ['/catalogue', 'catalogue'], ['/services', 'services'], ['/a-propos', 'about'], ['/contact', 'contact']];
export default function ShopShell({ children }: { children: ReactNode }) {
  const s = useShop();
  const [open, setOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const path = usePathname();
  const waBase = s.config.whatsapp ? 'https://wa.me/' + s.config.whatsapp : 'https://wa.me/21627031500';
  return <>
    <a className="skip-link" href="#main">{s.t('skip')}</a>
    <div className="top-bar"><span>IONARA / {s.t('tunisia')} · D17 · Flouci · Wafacash · izi Zitouna · Virement · Solde Ooredoo</span><span>FR · EN · العربية</span></div>
    <header className="site-header">
      <div className="header-row">
        <Link href="/" className="brand" aria-label="IONARA"><img src="/assets/logo/ionara-logo.svg" alt="" width="44" height="44" /><span>IONARA<span className="brand-dot">.</span></span></Link>
        <nav className="desktop-nav" aria-label={s.t('menu')}>
          {links.map(([href, key]) => <Link href={href} key={href} aria-current={path === href ? 'page' : undefined}>{s.t(key)}</Link>)}
          <button type="button" className="nav-track-btn" onClick={() => s.setModal('track')}>{s.t('trackOrderNav')}</button>
          {s.user?.role === 'admin' && <Link href="/admin" aria-current={path === '/admin' ? 'page' : undefined}>{s.t('adminNav')}</Link>}
        </nav>
        <div className="header-controls">
          <label className="select-label"><Globe2 size={16} /><span className="sr-only">{s.t('language')}</span><select aria-label={s.t('language')} value={s.locale} onChange={e => s.setLocale(e.target.value as Locale)}><option value="fr">FR</option><option value="en">EN</option><option value="ar">العربية</option></select></label>
          <label><span className="sr-only">{s.t('currency')}</span><select aria-label={s.t('currency')} value={s.currency} onChange={e => s.setCurrency(e.target.value as CurrencyCode)}><option>TND</option><option>EUR</option><option>USD</option></select></label>
          <button className="account-button" onClick={() => s.setModal(s.user ? 'account' : 'auth')}>{s.user ? s.t('account') : s.t('login')}</button>
          <button className="cart-button icon-button" aria-label={s.t('cart')} onClick={() => s.setModal('cart')}><ShoppingBag size={20} /><span>{s.cart.reduce((a, b) => a + b.quantity, 0)}</span></button>
          <button className="mobile-menu icon-button" aria-label={s.t('menu')} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="mobile-nav" aria-label={s.t('menu')}>
        {links.map(([href, key]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{s.t(key)}</Link>)}
        <button type="button" className="text-link" onClick={() => { setOpen(false); s.setModal('track'); }}>{s.t('trackOrderNav')}</button>
      </nav>}
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer">
      <div><Link href="/" className="brand"><Gamepad2 /> IONARA<span className="brand-dot">.</span></Link><p>{s.t('footerText')}</p></div>
      <nav aria-label={s.t('menu')}>
        {links.slice(1).map(([href, key]) => <Link key={href} href={href}>{s.t(key)}</Link>)}
        <button type="button" className="text-link" onClick={() => s.setModal('track')}>{s.t('trackOrderNav')}</button>
        <Link href="/conditions">{s.t('legalLink')}</Link>
        <Link href="/admin">{s.t('adminNav')}</Link>
      </nav>
      <small>© {new Date().getFullYear()} IONARA. {s.t('rights')}<br />{s.t('trademarkDisclaimer')}</small>
    </footer>
    <aside className="live-support-widget" aria-label={s.t('liveSupport')}>
      {supportOpen && <div className="support-popover">
        <div className="support-head">
          <div>
            <strong>IONARA {s.t('liveSupport')}</strong>
            <span className="support-status"><span className="stock-dot" />{s.t('supportOnline')}</span>
          </div>
          <button type="button" className="icon-button" aria-label={s.t('close')} onClick={() => setSupportOpen(false)}><X size={15} /></button>
        </div>
        <div className="support-topics">
          {(['supportTopicStock', 'supportTopic2fa', 'supportTopicReceipt'] as const).map(topicKey => (
            <a key={topicKey} className="plan-chip" href={waBase + '?text=' + encodeURIComponent('IONARA Support: ' + s.t(topicKey))} target="_blank" rel="noopener noreferrer">
              <span>{s.t(topicKey)}</span>
            </a>
          ))}
        </div>
        <div className="button-row">
          <a className="button primary" href={waBase} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />WhatsApp</a>
          <a className="button secondary" href={s.config.instagram || 'https://www.instagram.com/ionara_shop/'} target="_blank" rel="noopener noreferrer"><Instagram size={16} />Instagram</a>
        </div>
      </div>}
      <button type="button" className="support-fab" aria-expanded={supportOpen} onClick={() => setSupportOpen(!supportOpen)}>
        <span className="stock-dot" />
        <MessageCircle size={18} />
        <span>{s.t('liveSupport')}</span>
      </button>
    </aside>
    <ShopDialogs />
    {s.toast && <div className="toast" role="status">{s.toast}</div>}
  </>;
}
