import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  KeyRound,
  CheckCircle2,
  Smartphone,
  History,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';

export const SettingsView: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'privacy' | 'notifications'>('profile');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Privacy states
  const [shareAnonymousResearch, setShareAnonymousResearch] = useState(false);
  const [allowAiHeuristics, setAllowAiHeuristics] = useState(true);
  const [hospitalDataExchange, setHospitalDataExchange] = useState(true);

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const [toastMessage, setToastMessage] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setToastMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setToastMessage('Passwords do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setToastMessage('Security credentials updated successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSavePreferences = () => {
    setToastMessage('System preferences saved and synced across sessions.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Platform Settings & Privacy Control
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage account security, two-factor authentication, privacy preferences, and communication alerts.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSection === 'profile'
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSection === 'security'
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Security & 2FA
        </button>
        <button
          onClick={() => setActiveSection('privacy')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSection === 'privacy'
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Privacy & AI Preferences
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSection === 'notifications'
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Notifications
        </button>
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Account Profile</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Full Name</span>
              <input
                type="text"
                disabled
                value={currentUser?.name || ''}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Email Address</span>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Assigned Role</span>
              <input
                type="text"
                disabled
                value={role?.toUpperCase() || ''}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-teal-600 uppercase"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Verified Phone</span>
              <input
                type="text"
                disabled
                value={currentUser?.phone || '+1 (555) 234-5678'}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security & 2FA Section */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound size={16} className="text-teal-500" />
              <span>Change Account Password</span>
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  placeholder="Repeat new password"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors shadow-xs"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication UI */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone size={16} className="text-teal-500" />
                  <span>Two-Factor Authentication (2FA)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Secure your account with multi-factor SMS or authenticator TOTP codes.
                </p>
              </div>

              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  setToastMessage(`2FA has been ${!twoFactorEnabled ? 'enabled' : 'disabled'}.`);
                  setTimeout(() => setToastMessage(''), 3000);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  twoFactorEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                }`}
              >
                {twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          {/* Login Activity */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-teal-500" />
              <span>Recent Login Activity</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Chrome on macOS (Current)</span>
                  <p className="text-[10px] text-slate-400">Springfield, OR · IP: 24.118.82.19</p>
                </div>
                <span className="text-emerald-600 font-sans font-semibold text-[10px]">Active Session</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Mobile Safari on iOS</span>
                  <p className="text-[10px] text-slate-400">Springfield, OR · IP: 24.118.82.20</p>
                </div>
                <span className="text-slate-400 font-sans text-[10px]">Yesterday, 07:15 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & AI Preferences Section */}
      {activeSection === 'privacy' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Health Data Privacy & AI Decision Support Controls
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">AI Health Decision Support Synthesis</p>
                <p className="text-slate-500">Allow AI assistant to cross-reference my symptoms with my clinical records history.</p>
              </div>
              <input
                type="checkbox"
                checked={allowAiHeuristics}
                onChange={e => setAllowAiHeuristics(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Inter-Hospital Clinical Data Exchange</p>
                <p className="text-slate-500">Enable fast secure encrypted record portability when referred to outside specialists.</p>
              </div>
              <input
                type="checkbox"
                checked={hospitalDataExchange}
                onChange={e => setHospitalDataExchange(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Anonymized Epidemiological Research</p>
                <p className="text-slate-500">De-identify vitals data for peer-reviewed cardiology clinical studies.</p>
              </div>
              <input
                type="checkbox"
                checked={shareAnonymousResearch}
                onChange={e => setShareAnonymousResearch(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notification Channels</h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Email Consultation Reminders</p>
                <p className="text-slate-500">Receive 24-hour advance calendar notifications.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">SMS Urgent Lab & Refill Alerts</p>
                <p className="text-slate-500">Direct mobile text alerts when critical lab releases or refills occur.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
