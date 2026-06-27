import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { setToken } from '../api/client';
import { authApi } from '../api/auth';

type Mode = 'login' | 'register' | 'forgot';

function PitutiMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="14" fill="url(#logo-grad)" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#c4b5e0" />
          <stop offset="100%" stopColor="#8B9FD4" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="30" r="14" fill="rgba(42,52,98,.85)" />
      <polygon points="14,21 18,10 24,20" fill="rgba(42,52,98,.85)" />
      <polygon points="15.5,20.5 18.5,12 22.5,19.5" fill="rgba(196,181,224,.5)" />
      <polygon points="28,20 34,10 38,21" fill="rgba(42,52,98,.85)" />
      <polygon points="29.5,19.5 33.5,12 36.5,20.5" fill="rgba(196,181,224,.5)" />
      <circle cx="21" cy="29" r="3" fill="#D4A820" />
      <ellipse cx="21" cy="29" rx="1.2" ry="3" fill="#0C0808" />
      <circle cx="22.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)" />
      <circle cx="31" cy="29" r="3" fill="#D4A820" />
      <ellipse cx="31" cy="29" rx="1.2" ry="3" fill="#0C0808" />
      <circle cx="32.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)" />
      <path d="M25 33 L26 34.5 L27 33 Z" fill="#F0A0B8" />
    </svg>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, padding: '.5rem', border: 'none', borderRadius: 'var(--r-md)',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      fontWeight: active ? 700 : 500, fontSize: '.875rem',
      cursor: 'pointer', transition: 'all var(--trans)', minHeight: 44,
    }}>
      {children}
    </button>
  );
}

export default function LoginPage() {
  const navigate    = useNavigate();
  const { t }       = useTranslation();
  const { setUser } = useUser();

  const [mode, setMode]             = useState<Mode>('login');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(true);

  const clearErrors = () => setErrors({});
  const reset = () => { setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors(); };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!email.trim())             e.email    = t('login.errEmailRequired');
    else if (!emailRe.test(email)) e.email    = t('login.errEmailInvalid');
    if (!password)                 e.password = t('login.errPasswordRequired');
    return e;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!name.trim())              e.name     = t('login.errNameRequired');
    if (!email.trim())             e.email    = t('login.errEmailRequired');
    else if (!emailRe.test(email)) e.email    = t('login.errEmailInvalid');
    if (!password)                 e.password = t('login.errPasswordRequired');
    else if (password.length < 8)  e.password = t('login.errPasswordMin');
    if (password !== confirm)      e.confirm  = t('login.errPasswordMatch');
    return e;
  };

  const validateForgot = () => {
    const e: Record<string, string> = {};
    if (!email.trim())             e.email = t('login.errEmailRequired');
    else if (!emailRe.test(email)) e.email = t('login.errEmailInvalid');
    return e;
  };

  const buildUserState = (u: { id: string; name: string; email: string; photoUrl?: string | null }) => ({
    id: u.id, name: u.name, email: u.email,
    phone: '', city: '', bio: '', photoUrl: u.photoUrl ?? null,
    avatar: u.name
      ? u.name.trim().split(' ').slice(0, 2).map(n => n[0]?.toUpperCase()).join('')
      : '?',
    color: 'var(--primary-hl)', colorFg: 'var(--primary)',
  });

  const persistSession = (user: any, token: string) => {
    setToken(token, rememberMe);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('pitutiuser', JSON.stringify(user));
    setUser(buildUserState(user));
  };

  const handleSubmit = async () => {
    /* FORGOT */
    if (mode === 'forgot') {
      const errs = validateForgot();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true); setErrors({});
      try { setSuccess(true); } finally { setLoading(false); }
      return;
    }

    /* REGISTER */
    if (mode === 'register') {
      const errs = validateRegister();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true); setErrors({});
      try {
        const res   = await authApi.register(name.trim(), email.trim().toLowerCase(), password);
        const user  = (res as any).data  ?? res;
        const token = (res as any).token ?? '';
        persistSession(user, token);
        navigate('/dashboard', { replace: true });
      } catch (e: any) {
        setErrors({ form: e?.response?.data?.error ?? e?.message ?? 'Erro no registo' });
      } finally { setLoading(false); }
      return;
    }

    /* LOGIN */
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setErrors({});
    try {
      const res   = await authApi.login(email, password);
      const user  = (res as any).data  ?? res;
      const token = (res as any).token ?? '';
      persistSession(user, token);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setErrors({ form: e?.response?.data?.error ?? e?.message ?? 'Credenciais invalidas' });
    } finally { setLoading(false); }
  };

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false); };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <PitutiMark />
        </div>

        {mode !== 'forgot' && (
          <div style={{
            display: 'flex', gap: '.25rem', background: 'var(--surface-offset)',
            borderRadius: 'var(--r-lg)', padding: '.25rem', marginBottom: '1.5rem',
          }}>
            <TabBtn active={mode === 'login'}    onClick={() => switchMode('login')}>
              {t('login.tabLogin')}
            </TabBtn>
            <TabBtn active={mode === 'register'} onClick={() => switchMode('register')}>
              {t('login.tabRegister')}
            </TabBtn>
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} noValidate>
          {errors.form && (
            <div style={{
              background: 'var(--err-hl)', border: '1.5px solid var(--err)',
              borderRadius: 'var(--r-md)', padding: '.625rem .875rem',
              color: 'var(--err)', fontSize: '.8125rem', fontWeight: 700,
              marginBottom: '1rem',
            }}>
              {errors.form}
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">{t('login.name')}</label>
              <input
                className={`form-input${errors.name ? ' field-error' : ''}`}
                type="text" value={name} autoComplete="name"
                onChange={e => setName(e.target.value)}
              />
              {errors.name && <span className="field-error-msg">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('login.email')}</label>
            <input
              className={`form-input${errors.email ? ' field-error' : ''}`}
              type="email" value={email}
              autoComplete={mode === 'register' ? 'email' : 'username'}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label">{t('login.password')}</label>
              <div className="field-icon-wrap">
                <input
                  className={`form-input${errors.password ? ' field-error' : ''}`}
                  type={showPwd ? 'text' : 'password'} value={password}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="field-icon"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? t('login.hidePwd') : t('login.showPwd')}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="field-error-msg">{errors.password}</span>}
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">{t('login.confirmPassword')}</label>
              <input
                className={`form-input${errors.confirm ? ' field-error' : ''}`}
                type={showPwd ? 'text' : 'password'} value={confirm}
                autoComplete="new-password"
                onChange={e => setConfirm(e.target.value)}
              />
              {errors.confirm && <span className="field-error-msg">{errors.confirm}</span>}
            </div>
          )}

          {mode !== 'forgot' && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              fontSize: '.875rem', color: 'var(--text-muted)',
              marginBottom: '1.25rem', cursor: 'pointer',
            }}>
              <input type="checkbox" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)} />
              {t('login.rememberMe')}
            </label>
          )}

          {success && mode === 'forgot' && (
            <div style={{
              background: 'var(--success-hl)', border: '1.5px solid var(--success)',
              borderRadius: 'var(--r-md)', padding: '.625rem .875rem',
              color: 'var(--success)', fontSize: '.8125rem', fontWeight: 700,
              marginBottom: '1rem',
            }}>
              {t('login.forgotSuccess')}
            </div>
          )}

          <button type="submit" className="pf-btn pf-btn--primary pf-btn--full" disabled={loading}>
            {loading
              ? t('common.loading')
              : mode === 'login'    ? t('login.submit')
              : mode === 'register' ? t('login.submitRegister')
              :                       t('login.submitForgot')}
          </button>

          {mode === 'forgot' && (
            <button type="button" className="pf-btn pf-btn--ghost pf-btn--full"
              style={{ marginTop: '.75rem' }} onClick={() => switchMode('login')}>
              {t('login.backToLogin')}
            </button>
          )}

          {mode === 'login' && (
            <button type="button" style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '.8125rem', cursor: 'pointer', marginTop: '.875rem',
              display: 'block', width: '100%', textAlign: 'center',
            }} onClick={() => switchMode('forgot')}>
              {t('login.forgotPassword')}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
