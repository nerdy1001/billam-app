import { LucideIcon } from "lucide-react"

interface GradientIconProps {
  icon: LucideIcon
  className?: string
}

export function GradientIcon({
  icon: Icon,
  className,
}: GradientIconProps) {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="billamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <Icon
        className={className}
        stroke="url(#billamGradient)"
      />
    </>
  )
}
