interface MiniVaccRingProps {
  coverage: number
  size?: number
  strokeWidth?: number
}

export default function MiniVaccRing({ coverage, size = 48, strokeWidth = 5 }: MiniVaccRingProps) {
  const r     = (size - strokeWidth) / 2
  const c     = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const track = 'var(--surface-offset)'

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={track} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:'stroke-dashoffset .5s cubic-bezier(.16,1,.3,1)' }}
        />
        <text x={size/2} y={size/2 + 3.5}
          textAnchor="middle"
          fontFamily="Nunito,sans-serif"
          fontWeight="800"
          fontSize={size * 0.24}
          fill={color}>
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize:'.55rem', fontWeight:800, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.05em' }}>
        Vacunas
      </span>
    </div>
  )
}
