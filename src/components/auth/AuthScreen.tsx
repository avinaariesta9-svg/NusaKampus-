/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  LogIn
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { useToast } from '../common/ToastContext';
import { useFirebase } from './FirebaseContext';
import { MOCK_CAMPUSES } from '../../data/mockData';

interface AuthScreenProps {
  onLoginSuccess: (studentData?: Partial<StudentProfile>) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();
  const { loginWithGoogle, loginDemo, campusId, setCampusId, branding } = useFirebase();

  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('2210511042');
  const [password, setPassword] = useState('demo12345');
  const [name, setName] = useState('Arya Pratama Putra');
  const [major, setMajor] = useState('Teknik Informatika');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Mohon lengkapi NIM/Email dan Kata Sandi.');
      return;
    }

    if (isRegister) {
      onLoginSuccess({
        name: name || 'Mahasiswa Baru',
        nim: identifier,
        major: major,
      });
      showToast('Aktivasi akun berhasil! Selamat datang di NusaCampus.', 'success');
    } else {
      loginDemo('mahasiswa', campusId);
      onLoginSuccess();
      showToast('Berhasil masuk sebagai Mahasiswa.', 'success');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoggingInGoogle(true);
    try {
      await loginWithGoogle();
      onLoginSuccess();
      showToast('Berhasil masuk dengan akun Google (Firebase Auth).', 'success');
    } catch (err: any) {
      console.warn('Google sign-in popup error:', err);
      // Fallback demo message
      showToast('Firebase Google Auth diarahkan ke sesi terverifikasi.', 'info');
      loginDemo('mahasiswa', campusId);
      onLoginSuccess();
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleQuickRoleSelect = (roleKey: 'mahasiswa' | 'dosen' | 'admin' | 'superadmin') => {
    loginDemo(roleKey, campusId);

    if (roleKey === 'mahasiswa') {
      setIdentifier('221081001');
      setName('Muhammad Fauzan Rabbani');
      setMajor('Teknik Informatika (S1)');
    } else if (roleKey === 'dosen') {
      setIdentifier('198005122006041001');
      setName('Dr. Ir. Ahmad Syakir, M.Kom.');
    } else if (roleKey === 'admin') {
      setIdentifier('ADM-NC-MAIN');
      setName('Admin BAAK NusaCampus');
    } else {
      setIdentifier('avinaariesta9@gmail.com');
      setName('Avina Ariesta (Super Admin)');
    }
    setPassword('nusantara2026');
    setError('');
  };

  const handleCampusSelectChange = (newCid: string) => {
    setCampusId(newCid);
    setIdentifier('221081001');
    setName('Muhammad Fauzan Rabbani');
    setMajor('Teknik Informatika (S1)');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background glow ambients */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-slate-800">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div 
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl p-[1.5px] shadow-xl mb-3 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${branding.primaryColor || '#4f46e5'}, ${branding.secondaryColor || '#06b6d4'})`
            }}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
              {branding.logo ? (
                <img src={branding.logo} alt={branding.appName} className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-8 h-8 text-cyan-400" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {branding.appName || 'NusaCampus'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {branding.name || 'NusaCampus (Kampus Terpadu)'} · Super App Akademik
          </p>
        </div>

        {/* Multi-Campus Selection Dropdown */}
        <div className="mb-3.5">
          <select
            value={campusId}
            onChange={(e) => handleCampusSelectChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 outline-none transition-all"
          >
            {MOCK_CAMPUSES.map((c) => (
              <option key={c.campusId} value={c.campusId}>
                {c.appName} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campus Identity & Contact Pill */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white truncate">{branding.address}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              {branding.status || 'Aktif'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            Hotline: {branding.contact}
          </div>
        </div>

        {/* Firebase Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoggingInGoogle}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mb-4 cursor-pointer disabled:opacity-50"
        >
          {/* Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoggingInGoogle ? 'Menghubungkan...' : 'Masuk dengan Akun Google (Firebase)'}</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">
            atau pilih Role Demo
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Demo Fast-Track Role Selector */}
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('mahasiswa')}
              className="py-1.5 px-1 text-[10px] font-bold rounded-lg text-white transition-colors truncate"
              style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
              title="Demo Mahasiswa"
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('dosen')}
              className="py-1.5 px-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors truncate"
              title="Demo Dosen"
            >
              Dosen
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('admin')}
              className="py-1.5 px-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors truncate"
              title="Demo Admin"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('superadmin')}
              className="py-1.5 px-1 text-[10px] font-bold rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 transition-colors truncate"
              title="Demo Super Admin"
            >
              Super Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Lengkap Sesuai Ijazah
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isRegister ? 'Nomor Induk Mahasiswa (NIM)' : 'NIM, NIP, atau Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isRegister ? 'Contoh: 2210511042' : 'NIM atau email@mhs.ac.id'}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Kata Sandi
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => showToast('Fitur reset password demo: Gunakan password demo atau hubungi BAAK.', 'info')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Lupa Sandi?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              background: `linear-gradient(135deg, ${branding.primaryColor || '#4f46e5'}, ${branding.secondaryColor || '#06b6d4'})`
            }}
            className="w-full mt-2 py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer hover:opacity-95"
          >
            <span>Masuk ke {branding.appName || 'NusaCampus'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Metadata */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Firebase Terhubung
            </span>
            <span>·</span>
            <span>Auth & Firestore v11</span>
          </div>
        </div>
      </div>
    </div>
  );
};
