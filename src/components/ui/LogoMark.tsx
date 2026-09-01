'use client'

import { memo } from 'react'
import Image from 'next/image'
import { AppStrings } from '@/lib/strings'

function LogoMark() {
  return (
    <div className="text-center">
      <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full bg-background md:h-56 md:w-56">
        <Image
          src="/logo-mark.jpg"
          alt=""
          fill
          className="object-contain p-4 mix-blend-multiply"
          sizes="224px"
          priority
        />
      </div>
      <p className="mt-4 text-base font-medium uppercase tracking-[0.2em] text-stone-900 md:text-lg">
        {AppStrings.brand.lockup}
      </p>
    </div>
  )
}

export default memo(LogoMark)
