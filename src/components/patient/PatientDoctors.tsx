import React, { useState } from 'react';
import {
  Stethoscope,
  Star,
  Clock,
  MapPin,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Doctor } from '../../types';

interface PatientDoctorsProps {
  onNavigate: (path: string) => void;
}

export const PatientDoctors: React.FC<PatientDoctorsProps> = ({ onNavigate }) => {
  const doctors = StorageService.getDoctors();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [expFilter, setExpFilter] = useState('all');

  const departments = Array.from(new Set(doctors.map(d => d.department)));

  const filteredDoctors = doctors.filter(doc => {
    const q = search.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q);

    const matchesDept = deptFilter === 'all' || doc.department === deptFilter;

    let matchesExp = true;
    if (expFilter === '10plus') matchesExp = doc.experienceYears >= 10;
    else if (expFilter === '15plus') matchesExp = doc.experienceYears >= 15;

    return matchesSearch && matchesDept && matchesExp;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Physicians & Clinical Specialists
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect with board-certified physicians across specialized medical departments.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md self-start sm:self-auto">
          {filteredDoctors.length} Specialists Available
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by physician name, specialty, or condition..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={expFilter}
            onChange={e => setExpFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Any Experience</option>
            <option value="10plus">10+ Years</option>
            <option value="15plus">15+ Years</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor Avatar and Headline */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center font-bold text-teal-700 dark:text-teal-300 shrink-0 overflow-hidden ring-1 ring-teal-500/20">
                  {doc.avatar ? (
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Stethoscope size={24} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold truncate">
                    {doc.specialization}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{doc.department}</p>
                </div>
              </div>

              {/* Rating & Exp badge */}
              <div className="flex items-center gap-3 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={14} className="fill-current" />
                  <span className="font-mono text-slate-800 dark:text-slate-200">{doc.rating}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-600 dark:text-slate-400 font-mono">
                  {doc.experienceYears} Years Exp
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-600 dark:text-slate-400 font-mono">
                  {doc.totalPatientsCount} Patients
                </span>
              </div>

              {/* Bio & Details */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span className="truncate">{doc.roomNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Days: {doc.availableDays.slice(0, 3).join(', ')}...</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate('/patient/appointments')}
                className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar size={14} />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
