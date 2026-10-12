import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StorageService } from '../../lib/storage';
import { Notification, UserRole } from '../../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onToggleMobileMenu,
  collapsed,
}) => {
  const { currentUser, role, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      const userNotifs = StorageService.getNotifications().filter(n => n.userId === currentUser.id);
      setNotifications(userNotifs);
    }
  }, [currentUser, currentPath]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    if (currentUser) {
      StorageService.markAllNotificationsAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Home', path: '/' }];

    return parts.map((part, index) => {
      const path = '/' + parts.slice(0, index + 1).join('/');
      const formatted = part
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { label: formatted, path };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
        collapsed ? 'left-0 md:left-16' : 'left-0 md:left-64'
      }`}
    >
      {/* Left zone: Mobile toggle & Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">HealthVault</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <button
                onClick={() => onNavigate(crumb.path)}
                className={`hover:text-teal-600 dark:hover:text-teal-400 transition-colors ${
                  idx === breadcrumbs.length - 1 ? 'font-semibold text-slate-900 dark:text-white' : ''
                }`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center/Right zone: Global search, Quick Demo Switcher, Theme, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
          title="Search patients, doctors, records (Ctrl+K)"
        >
          <Search size={14} className="text-slate-400 dark:text-slate-500" />
          <span className="hidden md:inline">Search records, doctors...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Demo Switcher Quick Menu (for academic evaluators) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold hover:bg-teal-100/70 transition-colors shadow-2xs"
            title="Switch Demo Role for academic presentation"
          >
            <Sparkles size={13} className="text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="capitalize">{role || 'Select'}</span>
            <ChevronDown size={13} className="text-teal-600 dark:text-teal-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Switch Demo Workspace</p>
                <p className="text-[11px] text-slate-400">Instant login for presentation</p>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('patient');
                  setShowRoleMenu(false);
                  onNavigate('/patient/dashboard');
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  role === 'patient' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-[10px] text-slate-400">Patient Dashboard</p>
                </div>
                {role === 'patient' && <CheckCircle2 size={14} />}
              </button>

              <button
                onClick={() => {
                  switchDemoRole('doctor');
                  setShowRoleMenu(false);
                  onNavigate('/doctor/dashboard');
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  role === 'doctor' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <p className="font-medium">Dr. Emily Carter, MD</p>
                  <p className="text-[10px] text-slate-400">Cardiology Specialist</p>
                </div>
                {role === 'doctor' && <CheckCircle2 size={14} />}
              </button>

              <button
                onClick={() => {
                  switchDemoRole('admin');
                  setShowRoleMenu(false);
                  onNavigate('/admin/dashboard');
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  role === 'admin' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <p className="font-medium">Dr. Marcus Vance</p>
                  <p className="text-[10px] text-slate-400">System Administrator</p>
                </div>
                {role === 'admin' && <CheckCircle2 size={14} />}
              </button>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 px-3 py-1">
                <button
                  onClick={() => {
                    StorageService.resetAll();
                    window.location.reload();
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Reset all demo data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        StorageService.markNotificationAsRead(n.id);
                        if (n.link) onNavigate(n.link);
                        setShowNotifMenu(false);
                      }}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.read ? 'bg-slate-50/70 dark:bg-slate-800/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(n.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate(`/${role}/notifications`);
                  }}
                  className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <button
          onClick={() => onNavigate('/settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-85 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 overflow-hidden ring-1 ring-slate-300 dark:ring-slate-600">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              currentUser?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[130px]">
              {currentUser?.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5 leading-none">
              {role}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
