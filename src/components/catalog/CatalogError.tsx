'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { AppStrings } from '@/lib/strings'

export default function CatalogError() {
  const router = useRouter()

  return (
    <section className="section-y">
      <div className="container-lumira py-20 text-center">
        <p className="text-sm text-muted">{AppStrings.catalog.loadError}</p>
        <div className="mt-4">
          <Button type="button" onClick={() => router.refresh()}>
            {AppStrings.catalog.retry}
          </Button>
        </div>
      </div>
    </section>
  )
}
