import React, { useState } from 'react';
import { UserRole, Driver } from '../types';
import { Shield, Smartphone, Key, Lock, User, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ManivthaLogo from './ManivthaLogo';

interface SignInProps {
  drivers: Driver[];
  onSignIn: (role: UserRole, driverId: string | null, userName: string) => void;
  theme: 'light' | 'dark';
}

export default function SignIn({ drivers, onSignIn, theme }: SignInProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'driver'>('admin');
  
  // Admin credentials
  const [email, setEmail] = useState('admin@manivtha.com');
  const [adminPass, setAdminPass] = useState('admin');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminRole, setAdminRole] = useState<UserRole.ADMIN | UserRole.OPERATIONS>(UserRole.ADMIN);

  // Driver credentials
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || 'DR-01');
  const [driverPin, setDriverPin] = useState('1234');
  const [showDriverPin, setShowDriverPin] = useState(false);

  // General state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !adminPass) {
      setError('Please fill in all administrator credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating server handshake
    setTimeout(() => {
      setIsLoading(false);
      // Accepting admin/admin or any custom
      if ((email.toLowerCase() === 'admin@trippilot.pro' || email.toLowerCase() === 'admin@manivtha.com') && adminPass === 'admin') {
        const displayName = adminRole === UserRole.ADMIN ? 'Chief Controller' : 'Ops Dispatcher';
        onSignIn(adminRole, null, displayName);
      } else if (email && adminPass) {
        // Fallback for custom entries to keep testing simple
        onSignIn(adminRole, null, email.split('@')[0]);
      } else {
        setError('Invalid administrator email or password.');
      }
    }, 850);
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDriverId) {
      setError('Please select a driver profile.');
      return;
    }

    if (driverPin.length < 4) {
      setError('Driver dispatch PIN must be at least 4 digits.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const chosenDriver = drivers.find(d => d.id === selectedDriverId);
      if (chosenDriver) {
        onSignIn(UserRole.DRIVER, selectedDriverId, chosenDriver.name);
      } else {
        setError('Pilot registration profile not found.');
      }
    }, 850);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Dynamic ambient backdrops */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="w-full max-w-md space-y-8 p-8 rounded-[36px] border border-white/15 dark:border-white/5 bg-white/70 dark:bg-slate-950/40 backdrop-blur-3xl shadow-2xl bento-glass-enhanced liquid-glass-glow"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <ManivthaLogo size="lg" pulse={true} className="mb-1" />
          <div>
            <h2 id="signin-app-m-title" className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-650 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent leading-none">
              MANIVTHA
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-indigo-650 dark:text-indigo-400 font-extrabold mt-1">Tour & Travels</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px]">
            Access the iOS 27 Liquid Glass Corporate Command Suite
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="flex bg-slate-100 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-1 items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Duty Officer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('driver');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'driver'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mission Pilot
          </button>
        </div>

        {/* Error Indicator */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 dark:text-rose-450 font-semibold"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* ADMIN/OPERATIONS FORM */}
        {activeTab === 'admin' && (
          <form className="space-y-5" onSubmit={handleAdminSubmit}>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                Duty Division
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdminRole(UserRole.ADMIN)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adminRole === UserRole.ADMIN
                      ? 'bg-indigo-550/15 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => setAdminRole(UserRole.OPERATIONS)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adminRole === UserRole.OPERATIONS
                      ? 'bg-indigo-555/15 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  Ops Controller
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Duty Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@manivtha.com"
                  className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-550"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Access Code / Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter dispatch password"
                  className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-550"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Simulated Credentials Badge helper */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[11px] text-slate-500 dark:text-indigo-200/80 leading-normal">
              <span className="font-bold text-indigo-500 block mb-0.5">Quick Auto-Login Details:</span>
              Use <code className="bg-white/10 dark:bg-black/30 px-1 py-0.5 rounded text-indigo-650 dark:text-indigo-400 font-mono">admin@manivtha.com</code> & pass <code className="bg-white/10 dark:bg-black/30 px-1 py-0.5 rounded text-indigo-650 dark:text-indigo-400 font-mono">admin</code> to start administrative session.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold text-xs rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/15 flex items-center justify-center gap-2 cursor-pointer glass-shine-btn"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize Duty Officer Suite</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* DRIVERS FORM */}
        {activeTab === 'driver' && (
          <form className="space-y-5" onSubmit={handleDriverSubmit}>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                Select Pilot Profile
              </label>
              
              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {drivers.map((drv) => {
                  const isSelected = selectedDriverId === drv.id;
                  return (
                    <button
                      type="button"
                      key={drv.id}
                      onClick={() => setSelectedDriverId(drv.id)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all relative ${
                        isSelected
                          ? 'border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={drv.avatar}
                        alt={drv.name}
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          {drv.name.split(' ')[0]}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">{drv.id}</p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Pilot Command PIN
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showDriverPin ? 'text' : 'password'}
                  id="driver-pin-input"
                  value={driverPin}
                  onChange={(e) => setDriverPin(e.target.value)}
                  maxLength={4}
                  placeholder="Enter 4-digit security PIN"
                  className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 dark:text-white tracking-widest placeholder:tracking-normal placeholder:text-slate-450 focus:outline-none focus:border-indigo-550 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowDriverPin(!showDriverPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  {showDriverPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick Pilot credentials helper */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[11px] text-slate-500 dark:text-indigo-200/80 leading-normal">
              <span className="font-bold text-indigo-500 block mb-0.5">Quick Pilot Access Info:</span>
              Pick any Active Pilot and enter 4-digit PIN Code <code className="bg-white/10 dark:bg-black/30 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">1234</code>.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold text-xs rounded-2xl transition-all shadow-lg hover:shadow-indigo-505/15 flex items-center justify-center gap-2 cursor-pointer glass-shine-btn"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Establish Secure Pilot Uplink</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
