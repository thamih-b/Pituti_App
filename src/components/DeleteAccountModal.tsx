import { useState } from 'react'
import { PfBtn } from './FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: Props) {
  const [step, setStep]     = useState(1)   // 1 = warning, 2 = confirm
  const [typed, setTyped]   = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (typed.toLowerCase() !== 'eliminar') return
    setLoading(true)
    setTimeout(() => {
      setLoading(false); onConfirm()
    }, 1200)
  }

  const reset = () => { setStep(1); setTyped(''); setLoading(false); onClose() }

  return (
    <div className="delete-account-overlay" onClick={reset}>
      <div className="delete-account-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="delete-account-header">
          <div className="delete-account-warning-icon">⚠️</div>
          <div style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--err)', marginBottom:'.375rem' }}>
            Eliminar cuenta permanentemente
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
            Esta acción no se puede deshacer
          </div>
        </div>

        {step === 1 ? (
          /* ── Step 1: What will be lost ── */
          <div style={{ padding:'1.25rem 1.5rem' }}>
            <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)', marginBottom:'.875rem' }}>
              Si eliminas tu cuenta se perderá permanentemente:
            </div>
            {[
              { icon:'🐾', text:'El perfil completo de todas tus mascotas' },
              { icon:'💉', text:'Historial de vacunas y próximas dosis' },
              { icon:'💊', text:'Todos los medicamentos registrados' },
              { icon:'🌡️', text:'Síntomas, notas y registros veterinarios' },
              { icon:'📋', text:'Cuidados diarios y rutinas configuradas' },
              { icon:'👥', text:'Acceso compartido con otros cuidadores' },
            ].map(item => (
              <div key={item.text} style={{ display:'flex', alignItems:'flex-start', gap:'.625rem', marginBottom:'.5rem' }}>
                <span style={{ fontSize:'.875rem', flexShrink:0, marginTop:'.05rem' }}>{item.icon}</span>
                <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>{item.text}</span>
              </div>
            ))}
            <div style={{ background:'var(--err-hl)', border:'1.5px solid rgba(200,64,106,.3)', borderRadius:'var(--r-lg)', padding:'.75rem 1rem', marginTop:'.875rem', fontSize:'.8125rem', color:'var(--err)', fontWeight:700 }}>
              ⚠ No podrás recuperar estos datos después de eliminar tu cuenta.
            </div>
          </div>
        ) : (
          /* ── Step 2: Type confirmation ── */
          <div style={{ padding:'1.25rem 1.5rem' }}>
            <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1rem' }}>
              Para confirmar, escribe <strong style={{ color:'var(--text)', fontFamily:'monospace', background:'var(--surface-offset)', padding:'.1rem .35rem', borderRadius:'var(--r-sm)' }}>eliminar</strong> en el campo de abajo:
            </div>
            <input
              className="form-input"
              placeholder="eliminar"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              style={{ borderColor: typed && typed.toLowerCase()!=='eliminar' ? 'var(--err)' : 'var(--border)', marginBottom:'.875rem' }}
              autoFocus
            />
            {typed && typed.toLowerCase() !== 'eliminar' && (
              <div style={{ fontSize:'.75rem', color:'var(--err)', marginTop:'-.625rem', marginBottom:'.875rem', fontWeight:700 }}>
                Escribe exactamente "eliminar" (sin comillas)
              </div>
            )}
            <div style={{ fontSize:'.75rem', color:'var(--text-faint)', lineHeight:1.5 }}>
              Al hacer clic en "Eliminar definitivamente" tu cuenta y todos los datos asociados serán borrados permanentemente de los servidores de PITUTI.
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', gap:'.5rem', padding:'.875rem 1.5rem 1.125rem', borderTop:'1.5px solid var(--divider)', background:'var(--surface-2)' }}>
          <PfBtn variant="cancel" onClick={reset}>Cancelar</PfBtn>
          {step === 1 ? (
            <PfBtn variant="delete" onClick={() => setStep(2)}>Continuar →</PfBtn>
          ) : (
            <PfBtn
              variant="delete"
              loading={loading}
              disabled={typed.toLowerCase() !== 'eliminar'}
              onClick={handleConfirm}
            >
              Eliminar definitivamente
            </PfBtn>
          )}
        </div>
      </div>
    </div>
  )
}
