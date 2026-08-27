import Catalog from "@/components/sections/Catalog";
import Stories from "@/components/sections/Stories";
import DiscoverySets from "@/components/sections/DiscoverySets";
import Newsletter from "@/components/sections/Newsletter";
import AIConsultant from "@/components/ui/AIConsultant";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
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
      <div className="fixed bottom-6 left-6 z-50 max-w-[min(100%-5.5rem,22rem)]">
        <WhatsAppButton compact className="shadow-lg bg-white/95 backdrop-blur-sm" />
      </div>
      <AIConsultant />
    </main>
  );
}
