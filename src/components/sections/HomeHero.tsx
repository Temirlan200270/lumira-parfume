import Link from 'next/link'
import Button from '@/components/ui/Button'
import { AppStrings } from '@/lib/strings'

export default function HomeHero() {
  return (
    <section className="bg-background">
      <div className="container-lumira">
        <div className="flex min-h-[75vh] flex-col lg:flex-row lg:items-stretch">
          <div className="min-h-[50vw] bg-paper lg:min-h-0 lg:w-[55%]" aria-hidden="true" />
          <div className="flex flex-1 flex-col justify-center py-10 lg:w-[45%] lg:px-12">
            <h1 className="text-[40px] font-light leading-[48px] text-stone-900 md:text-[48px] md:leading-[56px]">
              {AppStrings.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-[22px] text-muted">{AppStrings.home.heroLead}</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="/catalog">
                <Button>{AppStrings.home.shop}</Button>
              </Link>
              <Link href="/how-it-works" className="text-sm text-stone-900 underline-offset-4 hover:underline">
                {AppStrings.home.howLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
