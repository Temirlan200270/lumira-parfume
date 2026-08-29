import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { WHATSAPP_LINK, WHATSAPP_PHONE } from '@/lib/constants'
import { AppStrings } from '@/lib/strings'

export default function Footer() {
  return (
    <footer className="mt-auto bg-footer text-stone-400">
      <div className="container-lumira section-y">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Logo inverted href="/" />
          </div>

          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-white">
              {AppStrings.footer.nav}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  {AppStrings.nav.catalog}
                </Link>
              </li>
              <li>
                <Link href="/?format=razliv" className="hover:text-white">
                  {AppStrings.nav.razliv}
                </Link>
              </li>
              <li>
                <Link href="/?format=raspiv" className="hover:text-white">
                  {AppStrings.nav.raspiv}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">
                  {AppStrings.nav.how}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-white">
              {AppStrings.footer.contacts}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp: {WHATSAPP_PHONE}
                </a>
              </li>
              <li>
                <Link href="/legal/oferta" className="hover:text-white">
                  Оферта
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-stone-800 pt-8 text-xs">{AppStrings.footer.copyright}</p>
      </div>
    </footer>
  )
}
