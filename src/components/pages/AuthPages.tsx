import React, { useState } from 'react';
import { Activity, Lock, Mail, User, Phone, Calendar, ArrowRight, AlertCircle, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onNavigate: (path: string) => void;
  initialRole?: 'patient' | 'doctor' | 'admin';
}

export const AuthPages: React.FC<AuthPageProps> = ({ mode, onNavigate, initialRole }) => {
  const { login, register, switchDemoRole } = useAuth();

  // Login states
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>(() => {
    return initialRole || 'patient';
  });
  const [email, setEmail] = useState(() => {
    if (initialRole === 'admin') return 'admin@healthvault.com';
    if (initialRole === 'doctor') return 'doctor@healthvault.com';
    return 'patient@healthvault.com';
  });
  const [password, setPassword] = useState(() => {
    if (initialRole === 'admin') return 'Admin@123';
    if (initialRole === 'doctor') return 'Doctor@123';
    return 'Patient@123';
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1994-05-12');
  const [regGender, setRegGender] = useState<'Female' | 'Male' | 'Other' | 'Prefer not to say'>('Female');
  const [regRole, setRegRole] = useState<'patient' | 'doctor'>('patient');
  const [regSpecialization, setRegSpecialization] = useState('Cardiology');
  const [regDepartment, setRegDepartment] = useState('Cardiology');
  const [regError, setRegError] = useState('');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Context is updated, navigate to corresponding role dashboard
        const trimmed = email.trim().toLowerCase();
        if (trimmed === 'doctor@healthvault.com') onNavigate('/doctor/dashboard');
        else if (trimmed === 'admin@healthvault.com') onNavigate('/admin/dashboard');
        else onNavigate('/patient/dashboard');
      } else {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = (role: 'patient' | 'doctor' | 'admin') => {
    switchDemoRole(role);
    if (role === 'patient') {
      setEmail('patient@healthvault.com');
      setPassword('Patient@123');
      onNavigate('/patient/dashboard');
    } else if (role === 'doctor') {
      setEmail('doctor@healthvault.com');
      setPassword('Doctor@123');
      onNavigate('/doctor/dashboard');
    } else {
      setEmail('admin@healthvault.com');
      setPassword('Admin@123');
      onNavigate('/admin/dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Full Name is required.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Valid email address is required.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone || '+1 (555) 000-0000',
        dob: regDob,
        gender: regGender,
        role: regRole,
        specialization: regSpecialization,
        department: regDepartment,
      });

      if (res.success) {
        if (regRole === 'patient') onNavigate('/patient/dashboard');
        else onNavigate('/doctor/dashboard');
      } else {
        setRegError(res.error || 'Registration failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 text-center focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
            <Activity size={22} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            HealthVault AI
          </span>
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          "Smarter Records. Better Care."
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* LOGIN VIEW */}
          {mode === 'login' && (
            <div>
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  HealthVault AI
                </h2>
                <p className="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400 mt-1">
                  Secure Healthcare Access
                </p>
              </div>

              {/* Explicit Role Radio Buttons */}
              <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Role Selection:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    onClick={() => {
                      setSelectedRole('admin');
                      setEmail('admin@healthvault.com');
                      setPassword('Admin@123');
                      setLoginError('');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedRole === 'admin'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedRole === 'admin'}
                      onChange={() => {}}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Admin</span>
                  </label>

                  <label
                    onClick={() => {
                      setSelectedRole('doctor');
                      setEmail('doctor@healthvault.com');
                      setPassword('Doctor@123');
                      setLoginError('');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedRole === 'doctor'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedRole === 'doctor'}
                      onChange={() => {}}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Doctor</span>
                  </label>

                  <label
                    onClick={() => {
                      setSelectedRole('patient');
                      setEmail('patient@healthvault.com');
                      setPassword('Patient@123');
                      setLoginError('');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedRole === 'patient'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedRole === 'patient'}
                      onChange={() => {}}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Patient</span>
                  </label>
                </div>
              </div>

              {/* THREE Role Selection Cards/Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
                {/* Tab 1: PATIENT */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('patient');
                    setEmail('patient@healthvault.com');
                    setPassword('Patient@123');
                    setLoginError('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'patient'
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedRole === 'patient'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <User size={15} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      PATIENT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Access your health records and appointments
                  </p>
                </button>

                {/* Tab 2: DOCTOR */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('doctor');
                    setEmail('doctor@healthvault.com');
                    setPassword('Doctor@123');
                    setLoginError('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'doctor'
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedRole === 'doctor'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Activity size={15} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      DOCTOR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Manage patients and clinical records
                  </p>
                </button>

                {/* Tab 3: ADMIN */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setEmail('admin@healthvault.com');
                    setPassword('Admin@123');
                    setLoginError('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'admin'
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedRole === 'admin'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Shield size={15} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Manage the healthcare platform
                  </p>
                </button>
              </div>

              {/* Demo Account Fill Button */}
              <div className="mb-4 flex items-center justify-between p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs">
                <div>
                  <span className="font-semibold text-teal-900 dark:text-teal-200">
                    Demo {selectedRole.toUpperCase()} Account:
                  </span>{' '}
                  <span className="font-mono text-teal-700 dark:text-teal-300 text-[11px]">
                    {selectedRole === 'patient'
                      ? 'patient@healthvault.com'
                      : selectedRole === 'doctor'
                      ? 'doctor@healthvault.com'
                      : 'admin@healthvault.com'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRole === 'patient') {
                      setEmail('patient@healthvault.com');
                      setPassword('Patient@123');
                    } else if (selectedRole === 'doctor') {
                      setEmail('doctor@healthvault.com');
                      setPassword('Doctor@123');
                    } else {
                      setEmail('admin@healthvault.com');
                      setPassword('Admin@123');
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs whitespace-nowrap"
                >
                  Use Demo Account
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email / User ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 pl-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="name@healthvault.com or User ID"
                    />
                    <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('/forgot-password')}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pl-9 pr-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="••••••••"
                    />
                    <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs tracking-wider shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}
                </button>
              </form>

              {/* Demo 1-Click Login Box */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Academic Evaluator Quick Demo Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoClick('patient')}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Patient</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">Sarah Johnson</p>
                    <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium mt-1 block">
                      Auto-Sign In →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoClick('doctor')}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Doctor</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">Dr. Carter, MD</p>
                    <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium mt-1 block">
                      Auto-Sign In →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoClick('admin')}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Admin</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">Dr. Vance</p>
                    <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium mt-1 block">
                      Auto-Sign In →
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  ← Back to Home
                </button>
                <div>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/register')}
                    className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Create one now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REGISTER VIEW */}
          {mode === 'register' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Create an account
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Join the HealthVault AI digital health records network.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Role selection tab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setRegRole('patient')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                        regRole === 'patient'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('doctor')}
                      className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                        regRole === 'doctor'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Doctor / Physician
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    *Note: Administrator accounts are strictly provisioned by hospital security audit policy.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    placeholder="eleanor@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={regDob}
                      onChange={e => setRegDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {regRole === 'doctor' && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40">
                    <div>
                      <label className="block text-[11px] font-semibold text-teal-900 dark:text-teal-200 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={regSpecialization}
                        onChange={e => setRegSpecialization(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-xs"
                        placeholder="Cardiology"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-teal-900 dark:text-teal-200 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={e => setRegDepartment(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-xs"
                        placeholder="Cardiology"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="Min 6 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  onClick={() => onNavigate('/login')}
                  className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {mode === 'forgot-password' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Reset password
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your verified email to receive secure recovery instructions.
                </p>
              </div>

              {forgotSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p>
                    If an account is associated with <strong>{forgotEmail}</strong>, password reset
                    instructions have been delivered.
                  </p>
                  <button
                    onClick={() => onNavigate('/login')}
                    className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setForgotSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Account email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="patient@healthvault.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    Send Recovery Instructions
                  </button>

                  <div className="text-center text-xs text-slate-500 pt-2">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('/login')}
                      className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
