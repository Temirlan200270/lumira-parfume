export default function PerfumeLoading() {
  return (
    <main className="flex-1 bg-background pb-32 lg:pb-0">
      <div className="container-lumira section-y">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_42%]">
          <div className="aspect-[3/4] bg-paper" />
          <div className="space-y-4">
            <div className="h-3 w-24 bg-paper" />
            <div className="h-10 w-3/4 bg-paper" />
            <div className="h-4 w-40 bg-paper" />
            <div className="mt-8 h-8 w-28 bg-paper" />
            <div className="h-11 w-full bg-paper" />
            <div className="h-11 w-full bg-paper" />
          </div>
        </div>
      </div>
    </main>
  )
}
