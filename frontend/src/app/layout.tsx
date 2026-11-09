import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import ShopShell from '@/components/ShopShell';
import { dictionaries, validLocale } from '@/i18n';
export async function generateMetadata(): Promise<Metadata> {
  const locale=validLocale((await cookies()).get('ionara_locale')?.value);
  return { title:'IONARA | '+dictionaries[locale].brandTag, description:dictionaries[locale].heroText, icons:{icon:'/assets/logo/ionara-logo.svg'} };
}
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const locale=validLocale((await cookies()).get('ionara_locale')?.value);
  return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} data-scroll-behavior="smooth"><body><ShopProvider locale={locale}><ShopShell>{children}</ShopShell></ShopProvider></body></html>;
}
