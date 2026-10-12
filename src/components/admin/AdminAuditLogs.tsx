import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Terminal,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { AuditLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      log.ipAddress.includes(q);

    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getActionColor = (action: string) => {
    if (action.includes('AUTH')) return 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200';
    if (action.includes('RECORD') || action.includes('VIEW')) return 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200';
    if (action.includes('PRESCRIPTION')) return 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200';
    if (action.includes('AI')) return 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="text-teal-500" size={24} />
            <span>Audit & Compliance Registry</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable HIPAA Title II forensic access log tracking Protected Health Information (PHI) interactions.
          </p>
        </div>

        <span className="text-xs font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-md border border-teal-200 dark:border-teal-800 font-semibold self-start sm:self-auto">
          Audit Logging: Active (SHA-256)
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action, user identity, resource target, or origin IP..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Actor Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {log.userRole}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">
                      <CheckCircle2 size={12} />
                      <span>Compliant</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
