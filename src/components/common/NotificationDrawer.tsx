/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCheck, BookOpen, FileText, BellRing, Settings } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkItemAsRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkItemAsRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'akademik' | 'tugas' | 'sistem'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'akademik':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'tugas':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'sistem':
        return <Settings className="w-4 h-4 text-slate-500" />;
      default:
        return <BellRing className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Notifikasi Kampus</h2>
            <span className="text-xs text-slate-400 font-semibold">
              ({notifications.filter(n => !n.isRead).length} belum dibaca)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllAsRead}
              className="px-2.5 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              title="Tandai semua dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Dibaca</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'akademik', label: 'Akademik' },
            { id: 'tugas', label: 'Tugas' },
            { id: 'sistem', label: 'Sistem' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada notifikasi pada kategori ini.
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkItemAsRead(item.id)}
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                  !item.isRead ? 'bg-indigo-50/40' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold ${!item.isRead ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                    {item.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
