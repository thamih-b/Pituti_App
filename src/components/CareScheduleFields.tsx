
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

interface Props {
  time:            string
  setTime:         (v: string) => void
  everyXDays:      boolean
  setEveryXDays:   (v: boolean) => void
  intervalDays:    string
  setIntervalDays: (fn: (prev: string) => string) => void
  recurring:       boolean
  setRecurring:    (v: boolean) => void
}

export default function CareScheduleFields({
  time, setTime,
  everyXDays, setEveryXDays,
  intervalDays, setIntervalDays,
  recurring, setRecurring,
}: Props) {
  return (
    <>
      <div className="modal-section">Horario y repetición</div>

      <div className="form-group">
        <label className="form-label">
          Horario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">🕐</span>
          <input className="form-input" type="time" value={time}
            onChange={e => setTime(e.target.value)}
            style={{ colorScheme:'light' }} />
        </div>
      </div>

      <div className="toggle-row">
        <div className="toggle-row-info">
          <div className="toggle-row-label">📅 Repetir cada X días</div>
          <div className="toggle-row-sub">
            {everyXDays ? `Cada ${intervalDays} días` : 'Se repite diariamente'}
          </div>
        </div>
        <Toggle on={everyXDays} onChange={setEveryXDays} />
      </div>

      {everyXDays && (
        <div className="form-group" style={{ marginTop:'.625rem' }}>
          <label className="form-label">Repetir cada</label>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.max(2, Number(d)-1)))}>−
            </button>
            <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)',
              minWidth:32, textAlign:'center' }}>
              {intervalDays}
            </div>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.min(60, Number(d)+1)))}>+
            </button>
            <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>días</span>
          </div>
        </div>
      )}

      <div className="toggle-row" style={{ marginTop: everyXDays ? '.75rem' : 0 }}>
        <div className="toggle-row-info">
          <div className="toggle-row-label">🔁 Recurrente</div>
          <div className="toggle-row-sub">
            {recurring ? 'Se repite indefinidamente' : 'Se realiza una sola vez'}
          </div>
        </div>
        <Toggle on={recurring} onChange={setRecurring} />
      </div>
    </>
  )
}
