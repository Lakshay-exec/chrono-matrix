import { useState } from 'react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from '../services/firebase';
import { isTemporaryEmail } from '../services/tempMailShield';
import { Mail, Lock, Loader2, ArrowRight, ShieldAlert, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthGateProps {
  onAuthenticated: () => void;
  onBackToLanding?: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated, onBackToLanding }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tempMailWarning, setTempMailWarning] = useState<string | null>(null);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMsg(null);
    if (val.includes('@')) {
      const check = isTemporaryEmail(val);
      setTempMailWarning(check.isTemp ? (check.reason || 'Disposable email detected.') : null);
    } else {
      setTempMailWarning(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      onAuthenticated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const check = isTemporaryEmail(email);
    if (check.isTemp) {
      setTempMailWarning(check.reason || 'Disposable email prohibited.');
      setErrorMsg('Temporary or disposable email addresses are not permitted.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onAuthenticated();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setErrorMsg('This email is already registered.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')
        setErrorMsg('Invalid email or password.');
      else setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-app)] text-[var(--text-main)] overflow-y-auto py-12 px-4 transition-colors">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-current opacity-[0.015] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-current opacity-[0.01] blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto page-enter my-auto">
        {/* Back button if landing is available */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity mb-6 font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to System Overview</span>
          </button>
        )}

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] opacity-60">
              CHRONO MATRIX
            </span>
          </div>

          <h1 className="font-serif-app text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            The Discipline Journal
          </h1>

          <p className="font-serif-app text-sm opacity-70 italic max-w-xs mx-auto">
            Sign in to synchronize your compounding trajectory across devices
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-2xl btn-solid-invert font-semibold text-sm
              transition-all flex items-center justify-center gap-3
              shadow-md btn-press disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-current opacity-10" />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] opacity-50">
              or email
            </span>
            <div className="h-px flex-1 bg-current opacity-10" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60 pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 opacity-40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full bg-current/5 border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all ${
                    tempMailWarning
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-current/10 focus:border-current/30'
                  }`}
                  required
                />
              </div>
              {tempMailWarning && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tempMailWarning}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 opacity-40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                  placeholder="••••••••"
                  className="w-full bg-current/5 border border-current/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-current/30 transition-all"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(tempMailWarning)}
              className="w-full py-2.5 px-4 rounded-2xl btn-solid-invert font-semibold text-xs sm:text-sm
                transition-all flex items-center justify-center gap-2
                disabled:opacity-40 disabled:cursor-not-allowed btn-press shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center text-xs opacity-60 pt-1">
            {mode === 'signin' ? (
              <p>
                No account?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMsg(null); }}
                  className="underline underline-offset-2 opacity-100 font-semibold ml-1"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMsg(null); }}
                  className="underline underline-offset-2 opacity-100 font-semibold ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security badges */}
        <div className="text-center mt-6 space-y-1 opacity-50 text-[10px] font-mono">
          <p>Protected by Firebase Cloud + Temp-Mail Shield</p>
        </div>
      </div>
    </div>
  );
};
