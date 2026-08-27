import Catalog from "@/components/sections/Catalog";
import Stories from "@/components/sections/Stories";
import DiscoverySets from "@/components/sections/DiscoverySets";
import Newsletter from "@/components/sections/Newsletter";
import AIConsultant from "@/components/ui/AIConsultant";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const perfumes = await getCatalog();

  return (
    <main className="flex-1">
      <Catalog perfumes={perfumes} />
      <Stories />
      <DiscoverySets />
      <Newsletter />
      <AIConsultant />
    </main>
  );
}
