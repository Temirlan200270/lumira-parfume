'use client'

interface PerfumeBottleProps {
  color: string
  accent: string
  label: string
}

export default function PerfumeBottle({ color, accent, label }: PerfumeBottleProps) {
  const safeId = label.replace(/[^a-zA-Z0-9_-]/g, '_')
  return (
    <svg viewBox="0 0 120 200" className="w-full h-full drop-shadow-sm md:drop-shadow-lg">
      <defs>
        <linearGradient id={`grad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      <rect x="42" y="10" width="36" height="50" rx="3" fill={color} opacity="0.9" />
      <rect x="48" y="0" width="24" height="12" rx="2" fill="#444" />
      <rect x="30" y="58" width="60" height="110" rx="6" fill={`url(#grad-${safeId})`} />
      <rect x="35" y="65" width="50" height="90" rx="2" fill="white" opacity="0.15" />
      <rect x="38" y="145" width="44" height="18" rx="1" fill="white" opacity="0.2" />
      <text x="60" y="157" textAnchor="middle" fill="white" fontSize="5" fontFamily="serif" opacity="0.9">
        {label}
      </text>
    </svg>
  )
}
