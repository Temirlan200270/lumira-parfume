import HomeHero from '@/components/sections/HomeHero'
import HowItWorksStrip from '@/components/sections/HowItWorksStrip'
import Hits from '@/components/sections/Hits'
import FormatTiles from '@/components/sections/FormatTiles'
import TrustRow from '@/components/sections/TrustRow'
import Stories from '@/components/sections/Stories'
import { getCatalog } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const perfumes = await getCatalog()

  return (
    <main className="flex-1">
      <HomeHero />
      <HowItWorksStrip />
      <Hits perfumes={perfumes} />
      <FormatTiles />
      <TrustRow />
      <Stories perfumes={perfumes} />
    </main>
  )
}
