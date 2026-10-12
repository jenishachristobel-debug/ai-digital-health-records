import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  FileText,
  FileCheck,
  MessageSquare,
  Shield,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Notification } from '../../types';
import { DashboardBackground } from './DashboardBackground';

interface NotificationsCenterProps {
  onNavigate: (path: string) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return StorageService.getNotifications().filter(n => n.userId === currentUser?.id);
  });

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    if (currentUser) {
      StorageService.markAllNotificationsAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={16} className="text-teal-600 dark:text-teal-400" />;
      case 'record':
        return <FileText size={16} className="text-indigo-600 dark:text-indigo-400" />;
      case 'prescription':
        return <FileCheck size={16} className="text-amber-600 dark:text-amber-400" />;
      case 'message':
        return <MessageSquare size={16} className="text-cyan-600 dark:text-cyan-400" />;
      default:
        return <Shield size={16} className="text-slate-600 dark:text-slate-400" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative space-y-6 max-w-4xl mx-auto">
      <DashboardBackground accentRole="patient" />

      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Bell size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Notifications & Clinical Alerts
                </h1>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Realtime updates on appointment schedules, diagnostic reports, and medicine refills.
              </p>
            </div>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline self-start sm:self-auto"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {['all', 'appointment', 'prescription', 'record', 'message'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === t
                  ? 'bg-teal-500 text-slate-950 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'all' ? 'All Alerts' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No notifications found under this category.
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkAsRead(n.id);
                if (n.link) onNavigate(n.link);
              }}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start justify-between gap-4 transform hover:-translate-y-1 hover:shadow-md ${
                !n.read
                  ? 'bg-white/95 dark:bg-slate-900/95 border-teal-300 dark:border-teal-700 shadow-xs ring-1 ring-teal-500/20'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 inline-block animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">
                  {new Date(n.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold inline-flex items-center gap-0.5 mt-2">
                  <span>View Details</span>
                  <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
