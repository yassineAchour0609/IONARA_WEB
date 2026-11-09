import { CatalogPage } from '@/components/ShopPages';
export default async function Page({ searchParams }: { searchParams: Promise<{category?:string}> }) {
  const params=await searchParams;
  return <CatalogPage key={params.category||'all'} initialCategory={params.category}/>;
}
