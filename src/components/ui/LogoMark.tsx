import Image from 'next/image'

export default function LogoMark() {
  return (
    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-white ring-1 ring-stone-200 md:h-40 md:w-40">
      <Image
        src="/logo.jpg"
        alt="Lumira parfumes"
        fill
        className="object-contain p-3"
        sizes="160px"
        priority
      />
    </div>
  )
}
