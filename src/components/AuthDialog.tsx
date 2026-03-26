// 🎬 ROOKNOMICS CINEMATIC UI: AuthDialog — dark cinematic auth panel
// ZERO LOGIC CHANGES — all handlers, hooks, OAuth, form logic preserved exactly
import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, BarChart2, Loader2 } from 'lucide-react';
import OtpDialog from './OtpDialog';
import { useAuth } from '../hooks/useAuth.js';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { googleAuth } from '@/lib/api.js';
import type { ViewType } from '@/pages/Index';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

// 🎬 ROOKNOMICS CINEMATIC UI: Shared input style
const inputBase = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  color: 'rgba(255,255,255,0.90)',
  fontSize: 13,
  padding: '10px 12px 10px 38px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
} as React.CSSProperties;

export default function AuthDialog({ open, onClose, setCurrentView }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const {
    handleLogin, isLoginLoading, loginError, clearLoginError, isLoggedIn,
    handleRegister, isRegisterLoading, registerError, clearRegisterError, otpSent,
    resetAuth,
  } = useAuth();

  // 🎬 All logic identical — zero logic change
  useEffect(() => {
    if (isLoggedIn && open) { handleClose(); }
  }, [isLoggedIn]);

  const handleClose = () => {
    setEmail(''); setPassword(''); setName('');
    setShowPassword(false); setMode('login');
    resetAuth(); onClose();
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode); setEmail(''); setPassword(''); setName('');
    clearLoginError(); clearRegisterError();
  };

  const handleOtpClose = () => { resetAuth(); };
  const handleOtpVerified = () => { handleClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      await handleRegister(name, email, password);
    } else {
      await handleLogin(email, password);
    }
  };

  if (!open) return null;

  if (otpSent) {
    return (
      <OtpDialog
        open={otpSent}
        email={email}
        onClose={handleOtpClose}
        onVerified={handleOtpVerified}
      />
    );
  }

  const isLoading = mode === 'login' ? isLoginLoading : isRegisterLoading;
  const error = mode === 'login' ? loginError : registerError;

  return (
    <>
      {/* 🎬 ROOKNOMICS CINEMATIC UI: Dark cinematic backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.80)',
          zIndex: 50,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
      />

      {/* 🎬 ROOKNOMICS CINEMATIC UI: Centered auth card with radial glow */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 51,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
        {/* Radial glow behind card */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative', zIndex: 1,
            background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 24px 48px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ padding: '40px 40px 36px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Chess rook icon */}
                <div style={{
                  width: 36, height: 36,
                  background: '#6366F1',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(99,102,241,0.35)',
                }}>
                  <BarChart2 size={18} color="white" strokeWidth={2} />
                </div>
                <span style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.90)',
                  letterSpacing: '-0.01em',
                }}>ROOKNOMICS</span>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.30)',
                  padding: 4, borderRadius: 4,
                  display: 'flex', alignItems: 'center',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget).style.color = 'rgba(255,255,255,0.70)'; }}
                onMouseLeave={e => { (e.currentTarget).style.color = 'rgba(255,255,255,0.30)'; }}
              >
                <X size={18} />
              </button>
            </div>

            <h2 style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.90)',
              marginBottom: 6,
            }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', marginBottom: 28 }}>
              {mode === 'login'
                ? 'Sign in to save your strategies and results.'
                : 'Start backtesting in seconds.'}
            </p>

            {/* Google OAuth */}
            <div style={{ marginBottom: 20 }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const decoded: any = jwtDecode(credentialResponse.credential!);
                    const res = await googleAuth({
                      googleId: decoded.sub,
                      email: decoded.email,
                      name: decoded.name,
                      avatar: decoded.picture,
                    });
                    if (res.token) {
                      localStorage.setItem('token', res.token);
                      setCurrentView('builder');
                      onClose();
                    }
                  } catch (err) {
                    console.error('Google login failed', err);
                    alert('Google login failed');
                  }
                }}
              />
            </div>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                marginBottom: 16,
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.20)',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ color: '#F43F5E', fontSize: 12, flexShrink: 0, marginTop: 1 }}>⚠</span>
                <p style={{ fontSize: 12, color: '#F43F5E', lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'signup' && (
                <div style={{ position: 'relative' }}>
                  <User size={14} color="rgba(255,255,255,0.30)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => { setName(e.target.value); clearRegisterError(); }}
                    disabled={isLoading}
                    required
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <Mail size={14} color="rgba(255,255,255,0.30)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); mode === 'login' ? clearLoginError() : clearRegisterError(); }}
                  disabled={isLoading}
                  required
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={14} color="rgba(255,255,255,0.30)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); mode === 'login' ? clearLoginError() : clearRegisterError(); }}
                  disabled={isLoading}
                  required
                  minLength={6}
                  style={{ ...inputBase, paddingRight: 38 }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.30)', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {mode === 'login' && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#818CF8' }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: isLoading ? 'rgba(99,102,241,0.60)' : '#6366F1',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '12px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 150ms ease, box-shadow 150ms ease',
                  marginTop: 4,
                }}
                onMouseEnter={e => { if (!isLoading) { (e.currentTarget).style.background = '#4F46E5'; (e.currentTarget).style.boxShadow = '0 0 20px rgba(99,102,241,0.30)'; } }}
                onMouseLeave={e => { (e.currentTarget).style.background = isLoading ? 'rgba(99,102,241,0.60)' : '#6366F1'; (e.currentTarget).style.boxShadow = 'none'; }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {mode === 'login' ? 'Signing in…' : 'Sending OTP…'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Mode toggle */}
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', textAlign: 'center', marginTop: 20 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
                disabled={isLoading}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#818CF8', fontWeight: 500 }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
