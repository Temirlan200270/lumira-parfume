import Link from 'next/link'
import { Check, Droplets, MessageCircle, Wallet } from 'lucide-react'
import { AppStrings } from '@/lib/strings'

const items = [
  { href: '/how-it-works', text: AppStrings.home.trustKaspi, icon: Wallet, external: false },
  { href: 'https://wa.me/77479192766', text: AppStrings.home.trustWhatsApp, icon: MessageCircle, external: true },
  { href: '/', text: AppStrings.home.trustVolume, icon: Droplets, external: false },
  { href: '/how-it-works', text: AppStrings.home.trustOriginal, icon: Check, external: false },
]

export default function TrustRow() {
  return (
    <section className="section-y bg-background">
      <div className="container-lumira grid grid-cols-1 gap-6 md:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-stone-900" strokeWidth={1.5} aria-hidden="true" />
              <span>{item.text}</span>
            </>
          )
          return item.external ? (
            <a
              key={item.text}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-stone-900"
            >
              {content}
            </a>
          ) : (
            <Link key={item.text} href={item.href} className="flex items-start gap-3 text-sm text-stone-900">
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
