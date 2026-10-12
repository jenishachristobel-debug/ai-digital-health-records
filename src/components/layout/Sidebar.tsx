import React from 'react';
import {
  Activity,
  Calendar,
  FileText,
  FileCheck,
  Bot,
  Users,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  UserCircle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadNotifsCount: number;
  unreadMsgsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  unreadNotifsCount,
  unreadMsgsCount,
}) => {
  const { currentUser, role, logout } = useAuth();

  const getNavLinks = () => {
    if (role === 'patient') {
      return [
        { path: '/patient/dashboard', label: 'Dashboard', icon: Activity },
        { path: '/patient/records', label: 'Medical Records', icon: FileText },
        { path: '/patient/appointments', label: 'Appointments', icon: Calendar },
        { path: '/patient/prescriptions', label: 'Prescriptions', icon: FileCheck },
        { path: '/patient/documents', label: 'Documents', icon: FileCheck },
        { path: '/patient/doctors', label: 'Doctors', icon: Stethoscope },
        { path: '/patient/ai-assistant', label: 'AI Health Assistant', icon: Bot, isAccent: true },
        { path: '/patient/messages', label: 'Messages', icon: MessageSquare, badge: unreadMsgsCount },
        { path: '/patient/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount },
        { path: '/patient/profile', label: 'My Health Profile', icon: UserCircle },
      ];
    } else if (role === 'doctor') {
      return [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: Activity },
        { path: '/doctor/patients', label: 'Patients', icon: Users },
        { path: '/doctor/appointments', label: 'Schedule', icon: Calendar },
        { path: '/doctor/records', label: 'Clinical Records', icon: FileText },
        { path: '/doctor/prescriptions', label: 'Prescriptions', icon: FileCheck },
        { path: '/doctor/messages', label: 'Messages', icon: MessageSquare, badge: unreadMsgsCount },
        { path: '/doctor/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount },
        { path: '/doctor/profile', label: 'Doctor Profile', icon: UserCircle },
      ];
    } else {
      // admin
      return [
        { path: '/admin/dashboard', label: 'Overview', icon: Activity },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/appointments', label: 'All Appointments', icon: Calendar },
        { path: '/admin/records', label: 'Medical Records', icon: FileText },
        { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
        { path: '/admin/audit-logs', label: 'Audit & Compliance', icon: ShieldCheck },
        { path: '/admin/settings', label: 'System Settings', icon: Settings },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left group overflow-hidden focus:outline-none"
        >
          {/* Logo Mark: Medical Shield + AI Digital Node */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20 shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-3H8v-2h3V8h2v3h3v2h-3v3z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="text-base font-bold tracking-tight text-white block">HealthVault AI</span>
              <span className="text-[11px] text-teal-400 font-medium block -mt-1 tracking-wide">Digital Records</span>
            </div>
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role Banner */}
      {!collapsed && (
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-md bg-slate-800/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'admin' ? 'bg-amber-400' : role === 'doctor' ? 'bg-cyan-400' : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-semibold text-slate-200 capitalize tracking-wide">
              {role} Workspace
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Verified</span>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;

          return (
            <button
              key={link.path}
              onClick={() => onNavigate(link.path)}
              title={collapsed ? link.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                isActive
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              } ${link.isAccent && !isActive ? 'text-teal-300 hover:text-teal-200' : ''}`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? 'text-slate-950' : link.isAccent ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate flex-1 text-left">{link.label}</span>}
              {!collapsed && link.badge && link.badge > 0 ? (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono tabular-nums ${
                    isActive ? 'bg-slate-900 text-teal-300' : 'bg-teal-500/20 text-teal-300'
                  }`}
                >
                  {link.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/90">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onNavigate('/settings')}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-85 focus:outline-none"
            title="Settings & Profile"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden ring-1 ring-slate-600">
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
            {!collapsed && (
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate capitalize">{role}</p>
              </div>
            )}
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
