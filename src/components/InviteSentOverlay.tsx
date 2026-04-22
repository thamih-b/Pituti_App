interface Props {
  email:   string
  onClose: () => void
}

export default function InviteSentOverlay({ email, onClose }: Props) {
  return (
    <div className="invite-sent-overlay" onClick={onClose}>
      <div className="invite-sent-card" onClick={e => e.stopPropagation()}>
        <div className="invite-sent-icon">✉</div>

        <div style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--text)', marginBottom:'.5rem' }}>
          ¡Invitación enviada!
        </div>
        <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1.25rem' }}>
          Se ha enviado una invitación a<br/>
          <strong style={{ color:'var(--text)' }}>{email}</strong><br/>
          para unirse como cuidador.
        </div>

        <div style={{ background:'var(--success-hl)', border:'1.5px solid var(--success)', borderRadius:'var(--r-lg)', padding:'.625rem 1rem', marginBottom:'1.25rem', fontSize:'.8125rem', color:'var(--success)', fontWeight:700 }}>
          ✓ El enlace de invitación expira en 48 horas
        </div>

        <button className="pf-btn pf-btn--primary pf-btn--full" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  )
}
