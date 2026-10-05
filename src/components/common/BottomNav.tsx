/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BookOpen, CalendarDays, Bell, User } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  announcementBadgeCount?: number;
  taskPendingCount?: number;
  unreadNotifsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  taskPendingCount = 2,
  unreadNotifsCount = 3,
}) => {
  const navItems = [
    {
      id: 'home' as TabType,
      label: 'Beranda',
      icon: Home,
      badge: 0,
    },
    {
      id: 'akademik' as TabType,
      label: 'Akademik',
      icon: BookOpen,
      badge: taskPendingCount,
    },
    {
      id: 'jadwal' as TabType,
      label: 'Jadwal',
      icon: CalendarDays,
      badge: 0,
    },
    {
      id: 'notifikasi' as TabType,
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadNotifsCount,
    },
    {
      id: 'profil' as TabType,
      label: 'Profil',
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav 
      aria-label="Navigasi Utama" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all duration-200 select-none ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                </div>
                {item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight mt-0.5 transition-colors ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5 shadow-sm shadow-indigo-600/40" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
