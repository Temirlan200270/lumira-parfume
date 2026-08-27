import Link from 'next/link'
import Button from '@/components/ui/Button'
import { AppStrings } from '@/lib/strings'

export default function NotFound() {
  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y max-w-xl">
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.notFound.title}
        </h1>
        <p className="mt-4 text-sm text-muted">{AppStrings.notFound.lead}</p>
        <div className="mt-8">
          <Link href="/catalog">
            <Button>{AppStrings.notFound.cta}</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
