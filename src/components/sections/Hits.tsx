import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import type { Perfume } from '@/lib/data'
import { AppStrings } from '@/lib/strings'

export default function Hits({ perfumes }: { perfumes: Perfume[] }) {
  const hits = perfumes.filter((perfume) => perfume.isBestseller).slice(0, 4)
  if (hits.length === 0) return null

  return (
    <section className="section-y bg-background">
      <div className="container-lumira">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[28px] font-light leading-9 text-stone-900 md:text-[36px]">{AppStrings.home.hits}</h2>
          <Link href="/" className="text-sm text-stone-900 hover:underline">
            {AppStrings.home.allAromas} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {hits.map((perfume) => (
            <ProductCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      </div>
    </section>
  )
}
