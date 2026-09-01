type BadgeTone = 'hit' | 'new' | 'outline' | 'oos'
type BadgeSize = 'md' | 'sm'

interface BadgeProps {
  tone: BadgeTone
  size?: BadgeSize
  children: string
}

const toneClass: Record<BadgeTone, string> = {
  hit: 'bg-stone-900 text-stone-50',
  new: 'bg-accent text-stone-900',
  outline: 'border border-stone-200 bg-background/90 text-stone-900',
  oos: 'bg-stone-200 text-muted',
}

const sizeClass: Record<BadgeSize, string> = {
  md: 'h-5 px-2 text-xs tracking-[0.12em]',
  sm: 'h-4 px-1.5 text-[10px] tracking-[0.1em]',
}

export default function Badge({ tone, size = 'md', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium uppercase ${sizeClass[size]} ${toneClass[tone]}`}>
      {children}
    </span>
  )
}
