import { useNavigate, useLocation } from 'react-router-dom'
import { useT } from '../context/LanguageContext'

export default function NotFoundPage() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const t            = useT()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', lineHeight: 1 }}>🐾</div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
        404
      </h1>

      <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
        {t.notFound.title}
      </p>

      <p style={{
        fontSize: '.875rem',
        color: 'var(--text-muted)',
        maxWidth: 320,
        margin: 0,
      }}>
        {t.notFound.hint.replace('n', pathname)}
      </p>

      <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          {t.nav.dashboard}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← {t.btn.back}
        </button>
      </div>
    </div>
  )
}