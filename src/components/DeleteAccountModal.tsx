//traduzida

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PfBtn } from './FooterButtons'

interface Props {
  isOpen:    boolean
  onClose:   () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: Props) {
  const { t } = useTranslation()
  const [step, setStep]       = useState(1)
  const [typed, setTyped]     = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const typeWord = t('settings.deleteModal.typeWord')

  const handleConfirm = () => {
    if (typed.toLowerCase() !== typeWord) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onConfirm()
    }, 1200)
  }

  const reset = () => { setStep(1); setTyped(''); setLoading(false); onClose() }

  const LOSS_ITEMS = [
    { icon: '🐾', text: t('settings.deleteModal.petProfiles')  },
    { icon: '💉', text: t('settings.deleteModal.vaccines')     },
    { icon: '💊', text: t('settings.deleteModal.medications')  },
    { icon: '🌡️', text: t('settings.deleteModal.records')      },
    { icon: '📋', text: t('settings.deleteModal.dailyCares')   },
    { icon: '👥', text: t('settings.deleteModal.caregivers')   },
  ]

  return (
    <div className="delete-account-overlay" onClick={reset}>
      <div className="delete-account-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="delete-account-header">
          <div className="delete-account-warning-icon">⚠️</div>
          <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--err)', marginBottom: '.375rem' }}>
            {t('settings.deleteModal.title')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {t('settings.deleteModal.subtitle')}
          </div>
        </div>

        {step === 1 ? (
          /* ── Step 1: What will be lost ── */
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)', marginBottom: '.875rem' }}>
              {t('settings.deleteModal.willLose')}
            </div>
            {LOSS_ITEMS.map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '.625rem', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '.875rem', flexShrink: 0, marginTop: '.05rem' }}>{item.icon}</span>
                <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>{item.text}</span>
              </div>
            ))}
            <div style={{ background: 'var(--err-hl)', border: '1.5px solid rgba(200,64,106,.3)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginTop: '.875rem', fontSize: '.8125rem', color: 'var(--err)', fontWeight: 700 }}>
              {t('settings.deleteModal.warning')}
            </div>
          </div>
        ) : (
          /* ── Step 2: Type confirmation ── */
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {t('settings.deleteModal.typePrompt')}{' '}
              <strong style={{ color: 'var(--text)', fontFamily: 'monospace', background: 'var(--surface-offset)', padding: '.1rem .35rem', borderRadius: 'var(--r-sm)' }}>
                {typeWord}
              </strong>{' '}
              {t('modal.addInfo') ? '' : ''}
            </div>
            <input
              className="form-input"
              placeholder={typeWord}
              value={typed}
              onChange={e => setTyped(e.target.value)}
              style={{
                borderColor: typed && typed.toLowerCase() !== typeWord ? 'var(--err)' : 'var(--border)',
                marginBottom: '.875rem',
              }}
              autoFocus
            />
            {typed && typed.toLowerCase() !== typeWord && (
              <div style={{ fontSize: '.75rem', color: 'var(--err)', marginTop: '-.625rem', marginBottom: '.875rem', fontWeight: 700 }}>
                {t('settings.deleteModal.typeError')}
              </div>
            )}
            <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
              {t('settings.deleteModal.finalWarning')}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '.875rem 1.5rem 1.125rem', borderTop: '1.5px solid var(--divider)', background: 'var(--surface-2)' }}>
          <PfBtn variant="cancel" onClick={reset}>{t('btn.cancel')}</PfBtn>
          {step === 1 ? (
            <PfBtn variant="delete" onClick={() => setStep(2)}>
              {t('settings.deleteModal.continue')}
            </PfBtn>
          ) : (
            <PfBtn
              variant="delete"
              loading={loading}
              disabled={typed.toLowerCase() !== typeWord}
              onClick={handleConfirm}
            >
              {t('settings.deleteModal.confirmBtn')}
            </PfBtn>
          )}
        </div>

      </div>
    </div>
  )
}