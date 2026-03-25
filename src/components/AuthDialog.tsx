import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, BarChart2 } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth - just close
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/20 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-100 rounded-2xl w-full max-w-md shadow-[var(--shadow-lg)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#5b4cf0] flex items-center justify-center">
                      <BarChart2 size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-[#111110] text-lg">ROOKNOMICS</span>
                  </div>
                  <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors p-1">
                    <X size={20} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-[#111110] mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-[#6b6b6b] text-sm mb-6">
                  {mode === 'login' ? 'Sign in to save your strategies and results.' : 'Start backtesting in seconds.'}
                </p>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-sm font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:border-gray-300 shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-sm font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:border-gray-300 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    Apple
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-[#e8e7e4]" />
                  <span className="text-[#a8a8a8] text-xs">or continue with email</span>
                  <div className="flex-1 h-px bg-[#e8e7e4]" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a8a8]" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-[#a8a8a8] outline-none focus:border-[#5b4cf0]/50 transition-colors"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a8a8]" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-[#a8a8a8] outline-none focus:border-[#5b4cf0]/50 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a8a8]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-800 placeholder-[#a8a8a8] outline-none focus:border-[#5b4cf0]/50 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a8a8] hover:text-gray-700">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div className="text-right">
                      <button type="button" className="text-[#5b4cf0] text-xs hover:text-[#4a3de0] transition-colors font-medium">Forgot password?</button>
                    </div>
                  )}
                  <button type="submit" className="w-full bg-gradient-to-r from-[#5b4cf0] to-[#7c6ef7] hover:from-[#4a3de0] hover:to-[#6b5ef0] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(91,76,240,0.3)] hover:shadow-[0_8px_28px_rgba(91,76,240,0.4)]">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="text-[#6b6b6b] text-xs text-center mt-6">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[#5b4cf0] hover:text-[#4a3de0] transition-colors font-medium">
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
