import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authApi } from '../api/auth';
import { setToken } from '../api/client';

type Mode = 'login' | 'register' | 'forgot';

function buildUserState(user: { id: string; name: string; email: string; photoUrl?: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: '',
    city: '',
    bio: '',
    photoUrl: user.photoUrl ?? null,
    avatar: user.name
      ? user.name.trim().split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('')
      : '?',
    color: 'var(--primary-hl)',
    colorFg: 'var(--primary)',
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();

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
  const reset = () => {
    setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors();
  };

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email obrigatório';
    else if (!isValidEmail(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Password obrigatória';
    return e;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome obrigatório';
    if (!email.trim()) e.email = 'Email obrigatório';
    else if (!isValidEmail(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Password obrigatória';
    else if (password.length < 8) e.password = 'Password deve ter pelo menos 8 caracteres';
    if (password !== confirm) e.confirm = 'Passwords não coincidem';
    return e;
  };

  const validateForgot = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email obrigatório';
    else if (!isValidEmail(email)) e.email = 'Email inválido';
    return e;
  };

  const handleSubmit = async () => {
    // ---- FORGOT ----
    if (mode === 'forgot') {
      const errs = validateForgot();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true);
      setErrors({});
      try {
        // TODO: integrar endpoint de recuperação de password
        setSuccess(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    // ---- REGISTER ----
    if (mode === 'register') {
      const errs = validateRegister();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setLoading(true);
      setErrors({});
      try {
        const res = await authApi.register(name.trim(), email.trim().toLowerCase(), password);
        const { data: user, token } = res;

        setToken(token, rememberMe);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('pitutiuser', JSON.stringify(user));

        setUser(buildUserState(user));
        navigate('/dashboard', { replace: true });
      } catch (e: any) {
        const msg =
          e?.response?.data?.error ?? e?.message ?? 'Erro no registo';
        setErrors({ form: msg });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ---- LOGIN ----
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.login(email.trim().toLowerCase(), password);
      const { data: user, token } = res;

      setToken(token, rememberMe);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('pitutiuser', JSON.stringify(user));

      setUser(buildUserState(user));
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ?? e?.message ?? 'Erro na autenticação';
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false); };

  return (
    <div className="login-page">
      <form
        onSubmit={(ev) => { ev.preventDefault(); handleSubmit(); }}
        className="login-form"
        noValidate
      >
        <h1 className="login-title">
          {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Recuperar password'}
        </h1>

        {errors.form && <p className="form-error">{errors.form}</p>}

        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="reg-name">Nome</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete={mode === 'register' ? 'email' : 'username'}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        {mode !== 'forgot' && (
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrapper">
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label="Mostrar/ocultar password"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
        )}

        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmar password</label>
            <input
              id="reg-confirm"
              type={showPwd ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>
        )}

        {mode !== 'forgot' && (
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {' '}Lembrar-me
          </label>
        )}

        {success && mode === 'forgot' && (
          <p className="form-success">Verifique o seu email para recuperar a password.</p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? 'A processar...'
            : mode === 'login'
            ? 'Entrar'
            : mode === 'register'
            ? 'Registar'
            : 'Enviar'}
        </button>

        <div className="login-links">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => switchMode('register')}>
                Criar conta
              </button>
              <button type="button" onClick={() => switchMode('forgot')}>
                Esqueci a password
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button type="button" onClick={() => switchMode('login')}>
              Já tenho conta
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
