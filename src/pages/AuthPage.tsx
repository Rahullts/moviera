import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function AuthPage() {
  const nav = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setLocalError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setLocalError('Please enter email and password.'); return; }
    setEmailLoading(true);
    setLocalError('');
    setSuccessMsg('');
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        nav('/');
      } else {
        await signUpWithEmail(email, password);
        setSuccessMsg('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed.');
    } finally {
      setEmailLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }} className="auth-page">
      {/* Left side - brand */}
      <div className="auth-left" style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0E1318 0%, #080B0F 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '1rem', textShadow: '0 0 40px rgba(232,184,75,0.3)' }}>MOVIERA</div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '2.5rem', fontFamily: "'DM Sans', sans-serif" }}>
            The definitive South Indian cinema universe — Tamil, Telugu, Malayalam & Kannada.
          </p>
          {[
            '65,000+ South Indian Films',
            'Rate & Review like Letterboxd',
            'Upcoming Release Calendar',
            'Where to Watch on OTT',
            'Track across all 4 industries',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text2)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--gold)', textAlign: 'center', marginBottom: '4px' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Join Moviera'}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '13px', marginBottom: '28px', fontFamily: "'DM Sans', sans-serif" }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
          </p>

          <button onClick={handleGoogle} disabled={googleLoading} style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            background: '#fff', color: '#080B0F', border: 'none', cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '14px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)', marginBottom: '20px',
            opacity: googleLoading ? 0.7 : 1, transition: 'all 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--border2)' }} />
            <span style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>or continue with email</span>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--border2)' }} />
          </div>

          <form onSubmit={handleEmailAuth}>
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLocalError(''); }} placeholder="you@example.com" className="form-input" />
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLocalError(''); }} placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'} className="form-input" />

            {displayError && (
              <div style={{ background: 'rgba(232,75,75,0.1)', border: '0.5px solid rgba(232,75,75,0.4)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#E84B4B', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
                {displayError}
              </div>
            )}

            {successMsg && (
              <div style={{ background: 'rgba(75,232,122,0.1)', border: '0.5px solid rgba(75,232,122,0.4)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#4BE87A', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={emailLoading} style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--gold), var(--accent2))',
              color: '#080B0F', border: 'none', cursor: emailLoading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '14px',
              opacity: emailLoading ? 0.7 : 1, transition: 'all 0.2s',
            }}>
              {emailLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text3)', fontFamily: "'DM Sans', sans-serif" }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setLocalError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
