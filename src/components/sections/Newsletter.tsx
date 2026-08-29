'use client'

import { useState } from 'react'
import { AppStrings } from '@/lib/strings'
import { buildWhatsAppUrl } from '@/lib/order'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    window.open(buildWhatsAppUrl(`${AppStrings.home.newsletterKicker}: ${trimmed}`), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="newsletter" className="bg-stone-900 py-24 text-white">
      <div className="container-lumira max-w-3xl text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-stone-400">
          {AppStrings.home.newsletterKicker}
        </p>
        <h2 className="mb-6 text-[28px] font-light leading-9 md:text-[36px]">
          {AppStrings.home.newsletterTitle}
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-sm leading-[22px] text-stone-400">
          {AppStrings.home.newsletterLead}
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            {AppStrings.home.newsletterPlaceholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={AppStrings.home.newsletterPlaceholder}
            required
            className="h-11 flex-1 border border-stone-600 bg-stone-800 px-4 text-sm text-white placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            className="h-11 bg-white px-8 text-xs uppercase tracking-[0.2em] text-stone-900 hover:bg-stone-100"
          >
            {AppStrings.home.newsletterSubmit}
          </button>
        </form>
        <p className="mt-4 text-xs text-stone-500">{AppStrings.home.newsletterWhatsApp}</p>
      </div>
    </section>
  )
}
