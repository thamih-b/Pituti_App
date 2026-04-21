interface VaccRingProps {
  coverage: number  
  size?: number      
  strokeWidth?: number
}

export default function VaccRing({ coverage, size = 64, strokeWidth = 6 }: VaccRingProps) {
  const r   = (size - strokeWidth) / 2
  const c   = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const label = coverage >= 80 ? '💉' : coverage >= 50 ? '⚠' : '✕'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--surface-offset)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)' }}
        />
        {/* Texto central */}
        <text
          x={size / 2} y={size / 2 + 4}
          textAnchor="middle"
          fontFamily="Nunito, sans-serif"
          fontWeight="800"
          fontSize={size * 0.22}
          fill="var(--text)"
        >
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize: '.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
        {label} Vacunas
      </span>
    </div>
  )
}
