type BadgeTone = 'hit' | 'new' | 'outline' | 'oos'

interface BadgeProps {
  tone: BadgeTone
  children: string
}

const toneClass: Record<BadgeTone, string> = {
  hit: 'bg-stone-900 text-stone-50',
  new: 'bg-accent text-stone-900',
  outline: 'border border-stone-200 bg-background/90 text-stone-900',
  oos: 'bg-stone-200 text-muted',
}

export default function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-5 items-center px-2 text-xs font-medium uppercase tracking-[0.12em] ${toneClass[tone]}`}
    >
      {children}
    </span>
  )
}
