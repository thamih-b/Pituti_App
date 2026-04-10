import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={[
        'relative flex shrink-0 items-center justify-center rounded-full',
        'bg-teal-100 font-semibold text-teal-800 overflow-hidden',
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={name}
    >
      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
