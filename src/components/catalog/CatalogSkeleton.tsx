export default function CatalogSkeleton() {
  return (
    <section className="section-y">
      <div className="container-lumira">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] bg-paper" />
          ))}
        </div>
      </div>
    </section>
  )
}
