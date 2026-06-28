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
      <line x1="14" y1="32" x2="22" y2="32.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.8" />
      <line x1="14" y1="34" x2="22" y2="33.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.7" />
      <line x1="30" y1="32.5" x2="38" y2="32" stroke="rgba(255,255,255,.5)" strokeWidth="0.8" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

interface FormFieldProps {
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  extra?: ReactNode;
}
function FormField({ type, label, value, onChange, placeholder, icon, error, hint, extra }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.375rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none', display: 'flex' }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '.625rem .75rem .625rem 2.25rem' : '.625rem .75rem',
            border: `1.5px solid ${error ? 'var(--err)' : 'var(--border)'}`,
            borderRadius: 'var(--r-lg)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '.9375rem',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 150ms',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? 'var(--err)' : 'var(--primary)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? 'var(--err)' : 'var(--border)'; }}
        />
      </div>
      {extra}
      {error && <span style={{ display: 'block', marginTop: '.25rem', fontSize: '.75rem', color: 'var(--err)', fontWeight: 600 }}>{error}</span>}
      {hint && !error && <span style={{ display: 'block', marginTop: '.25rem', fontSize: '.75rem', color: 'var(--text-faint)' }}>{hint}</span>}
    </div>
  );
}

function OrDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', margin: '.875rem 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
      <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
    </div>
  );
}

function SocialBtn({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
        padding: '.625rem', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)',
        background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit',
        fontSize: '.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all 150ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-offset)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
    >
      {icon} {label}
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {setUser} = useUser();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(true);

  const clearErrors = () => setErrors({});
  const reset = () => { setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors(); };

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = t('login.errEmailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t('login.errEmailInvalid');
    if (!password) e.password = t('login.errPasswordRequired');
    return e;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('login.errNameRequired');
    if (!email.trim()) e.email = t('login.errEmailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t('login.errEmailInvalid');
    if (!password) e.password = t('login.errPasswordRequired');
    else if (password.length < 8) e.password = t('login.errPasswordMin');
    if (password !== confirm) e.confirm = t('login.errPasswordMatch');
    return e;
  };

  const validateForgot = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = t('login.errEmailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t('login.errEmailInvalid');
    return e;
  };

  const handleSubmit = async () => {
    if (mode === 'forgot') {
      const errs = validateForgot();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true);
      setErrors({});
      try { setSuccess(true); } finally { setLoading(false); }
      return;
    }

    if (mode === 'login') {
      const errs = validateLogin();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true);
      setErrors({});
      try {
        const res = await authApi.login({ email, password });
        const authData = res.data as Record<string, any>;
        const user = authData.user ?? authData.data;
        const token = authData.token;
        if (!user || !token) throw new Error('Resposta de autenticação inválida');
        setToken(token, rememberMe);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('pitutiuser', JSON.stringify(user));
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: '',
          city: '',
          bio: '',
          photoUrl: null,
          avatar: user.name
            ? user.name.trim().split(' ').slice(0, 2).map((n: string) => n[0]?.toUpperCase()).join('')
            : '?',
          color: 'var(--primary-hl)',
          colorFg: 'var(--primary)',
        });
        navigate('/dashboard', { replace: true });
      } catch (e: any) {
        setErrors({ form: e?.response?.data?.error ?? e.message ?? 'Erro na autenticação' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── REGISTER ──────────────────────────────────────────────────────────────
    if (mode === 'register') {
      const errs = validateRegister();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true);
      setErrors({});
      try {
        const res = await authApi.register({ name, email, password });
        const authData = res.data as Record<string, any>;
        const user = authData.user ?? authData.data;
        const token = authData.token;
        if (!user || !token) throw new Error('Resposta de autenticação inválida');
        setToken(token, rememberMe);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('pitutiuser', JSON.stringify(user));
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: '',
          city: '',
          bio: '',
          photoUrl: null,
          avatar: user.name
            ? user.name.trim().split(' ').slice(0, 2).map((n: string) => n[0]?.toUpperCase()).join('')
            : '?',
          color: 'var(--primary-hl)',
          colorFg: 'var(--primary)',
        });
        navigate('/dashboard', { replace: true });
      } catch (e: any) {
        const msg =
          e?.response?.data?.error ??
          e?.response?.data?.errors?.[0]?.message ??
          e.message ??
          'Erro ao criar conta';
        setErrors({ form: msg });
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false); };

  // ── icons ─────────────────────────────────────────────────────────────────
  const emailIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  const nameIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  const lockIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', fontFamily: 'var(--font-body, sans-serif)' }}>
      {/* ── Form panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem' }}>
            <PitutiMark />
            <span style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Pituti</span>
          </div>

          {/* Mode tabs */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', gap: '.25rem', background: 'var(--surface-offset)', borderRadius: 'var(--r-lg)', padding: '.25rem', marginBottom: '1.5rem' }}>
              {(['login', 'register'] as Mode[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: '.5rem', border: 'none', borderRadius: 'var(--r-md)',
                    background: mode === m ? 'var(--surface)' : 'transparent',
                    color: mode === m ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: '.875rem', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 150ms',
                    boxShadow: mode === m ? 'var(--sh-sm)' : 'none',
                  }}
                >
                  {m === 'login' ? t('login.submitLogin') : t('login.submitRegister')}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          {mode === 'forgot' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '.25rem' }}>{t('login.forgotTitle', 'Recuperar senha')}</div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{t('login.forgotSubtitle', 'Enviaremos um link para o teu email')}</div>
            </div>
          )}

          {/* Global error */}
          {errors.form && (
            <div style={{ marginBottom: '.9rem', padding: '.7rem .85rem', borderRadius: 'var(--r-md)', background: 'var(--err-hl)', border: '1px solid var(--err)', color: 'var(--err)', fontWeight: 700, fontSize: '.85rem' }}>
              {errors.form}
            </div>
          )}

          {/* Fields */}
          {mode === 'register' && (
            <FormField type="text" label={t('settings.fullName', 'Nome completo')} value={name} onChange={v => { setName(v); clearErrors(); }} placeholder="Tu nombre" icon={nameIcon} error={errors.name} />
          )}

          <FormField type="email" label={t('settings.email', 'Email')} value={email} onChange={v => { setEmail(v); clearErrors(); }} placeholder="nome@email.com" icon={emailIcon} error={errors.email} />

          {mode !== 'forgot' && (
            <FormField
              type={showPwd ? 'text' : 'password'}
              label={t('login.labelPassword', 'Senha')}
              value={password}
              onChange={v => { setPassword(v); clearErrors(); }}
              icon={lockIcon}
              error={errors.password}
              hint={mode === 'register' ? t('login.passwordHint', 'Mínimo 8 caracteres') : undefined}
              extra={
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.25rem', fontSize: '.75rem', fontWeight: 700, fontFamily: 'inherit', marginTop: '.25rem' }}
                >
                  <EyeIcon open={showPwd} />
                  {showPwd ? t('login.hidePassword', 'Ocultar') : t('login.showPassword', 'Mostrar')}
                </button>
              }
            />
          )}

          {mode === 'register' && (
            <FormField type={showPwd ? 'text' : 'password'} label={t('login.labelConfirm', 'Confirmar senha')} value={confirm} onChange={v => { setConfirm(v); clearErrors(); }} icon={lockIcon} error={errors.confirm} />
          )}

          {/* Remember / Forgot */}
          {mode === 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', marginTop: '-.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.8125rem', color: 'var(--text-muted)' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                {t('login.rememberMe', 'Lembrar-me')}
              </label>
              <button type="button" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('login.forgotPassword', 'Esqueci a senha')}
              </button>
            </div>
          )}

          {/* Terms */}
          {mode === 'register' && (
            <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {t('login.termsPrefix', 'Ao criar conta, aceitas os ')}<a href="#" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('login.termsLink', 'Termos')}</a>{t('login.termsAnd', ' e ')}<a href="#" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('login.privacyLink', 'Privacidade')}</a>.
            </div>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', minHeight: 48,
              background: loading ? 'var(--primary-hl)' : 'linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%)',
              color: loading ? 'var(--primary)' : '#fff',
              border: 'none', borderRadius: 'var(--r-lg)', fontFamily: 'inherit',
              fontWeight: 800, fontSize: '.9375rem', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.625rem',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(91,108,158,.4)',
              transition: 'all 160ms', marginBottom: '.875rem',
            }}
          >
            {loading
              ? <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
              : null}
            {loading
              ? (mode === 'login' ? t('login.submittingLogin', 'A entrar…') : mode === 'register' ? t('login.submittingRegister', 'A criar conta…') : t('login.submittingForgot', 'A enviar…'))
              : (mode === 'login' ? t('login.submitLogin', 'Entrar') : mode === 'register' ? t('login.submitRegister', 'Criar conta') : t('login.submitForgot', 'Enviar link'))}
          </button>

          {/* Social */}
          {mode !== 'forgot' && (
            <>
              <OrDivider label={t('login.orContinueWith', 'ou continua com')} />
              <div style={{ display: 'flex', gap: '.625rem' }}>
                <SocialBtn icon={<GoogleIcon />} label="Google" onClick={() => navigate('/dashboard')} />
                <SocialBtn icon={<AppleIcon />} label="Apple" onClick={() => navigate('/dashboard')} />
              </div>
            </>
          )}

          {/* Switch mode link */}
          {!success && (
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: 'var(--text-muted)' }}>
              {mode === 'login'
                ? <>{t('login.noAccount', 'Não tens conta?')} <button type="button" onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>{t('login.registerFree', 'Regista-te')}</button></>
                : <>{t('login.hasAccount', 'Já tens conta?')} <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>{t('login.signIn', 'Entrar')}</button></>}
            </p>
          )}

          {/* Demo shortcut */}
          {mode !== 'forgot' && (
            <div style={{ textAlign: 'center', marginTop: '.75rem' }}>
              <button type="button" onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline dotted' }}>
                {t('login.enterDemo', 'Entrar em modo demo')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Brand panel (desktop only) ── */}
      <div style={{
        width: '45%', minHeight: '100dvh',
        background: 'linear-gradient(160deg, #2A3462 0%, #1a2050 40%, #3d2a62 100%)',
        padding: '3rem 3.5rem', display: 'flex', flexDirection: 'column', position: 'relative',
        // Hide on small screens via inline style — for proper responsiveness add a media query in CSS
      }} className="login-brand-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '3rem' }}>
          <PitutiMark />
          <span style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Pituti</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Cuida dos teus<br />companheiros com amor 🐾
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '36ch' }}>
            Vacinas, medicamentos, consultas e cuidados — tudo num só lugar para o bem-estar do teu pet.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .login-brand-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
