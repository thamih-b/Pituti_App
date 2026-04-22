import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?:    string        // specific route; if omitted uses navigate(-1)
  label?: string
}

export default function BackButton({ to, label = 'Volver' }: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      className="back-btn"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      type="button"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label}
    </button>
  )
}
