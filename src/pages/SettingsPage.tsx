import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import Input from '../components/Input'
import Button from '../components/Button'

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <div
      style={{ width: 40, height: 22, borderRadius: 99, background: on ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 200ms' }}
      onClick={() => setOn(v => !v)}
    >
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 'calc(100% - 19px)' : 3, transition: 'left 200ms' }} />
    </div>
  )
}

export default function SettingsPage() {
  const [name, setName] = useState('Thamires Lopes')
  const [email, setEmail] = useState('thamires@email.com')

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Ajustes</div><div className="page-subtitle">Cuenta y preferencias</div></div>
      </div>

      <div className="grid-2">
        {/* Profile */}
        <div className="card">
          <div className="card-title">Perfil</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--pal-lilac)', color: 'var(--nav-bg)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TL</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)' }}>Thamires Lopes</div>
              <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>thamires@email.com</div>
            </div>
          </div>
          <Input label="Nombre" name="name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Button onClick={() => showToast('Cambios guardados ✓')}>Guardar cambios</Button>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="card-title">Preferencias</div>
          {[
            { label: 'Tema de la aplicación', sub: 'Claro u oscuro', action: <button className="btn btn-secondary btn-sm" onClick={() => { document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); showToast('Tema cambiado') }}>Cambiar</button> },
            { label: 'Idioma', sub: 'Español', action: <select className="form-input" style={{ width: 'auto', padding: '.25rem .5rem', fontSize: '.8125rem' }}><option>Español</option><option>Português</option><option>English</option></select> },
          ].map(item => (
            <div key={item.label} className="list-item" style={{ cursor: 'default' }}>
              <div className="list-item-info"><div className="list-item-title">{item.label}</div><div className="list-item-sub">{item.sub}</div></div>
              {item.action}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginTop: '1.125rem' }}>
        <div className="card-title">Notificaciones</div>
        {[
          { label: 'Vacunas a vencer',       sub: '7 días antes del vencimiento',       on: true  },
          { label: 'Dosis de medicamentos',  sub: 'Recordatorio diario de dosis',       on: true  },
          { label: 'Síntomas sin resolución', sub: 'Cuando un síntoma lleva +3 días',  on: true  },
          { label: 'Resumen semanal',         sub: 'Cada lunes por email',               on: false },
        ].map(n => (
          <div key={n.label} className="list-item" style={{ cursor: 'default' }}>
            <div className="list-item-info"><div className="list-item-title">{n.label}</div><div className="list-item-sub">{n.sub}</div></div>
            <Toggle initial={n.on} />
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="card" style={{ marginTop: '1.125rem', borderColor: 'rgba(200,64,106,.25)' }}>
        <div className="card-title" style={{ color: 'var(--err)' }}>Zona de riesgo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text)' }}>Exportar datos</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Descarga un CSV con todo el historial de tus mascotas</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('CSV descargado')}>Exportar</button>
          </div>
          <div className="divider" style={{ margin: '.25rem 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--err)' }}>Eliminar cuenta</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Esta acción es irreversible y borrará todos tus datos</div>
            </div>
            <button className="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
