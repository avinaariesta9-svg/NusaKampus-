/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, Search, GraduationCap, MapPin, ChevronDown, Check, Bot } from 'lucide-react';
import { StudentProfile } from '../../types';
import { MOCK_CAMPUSES } from '../../data/mockData';
import { useToast } from './ToastContext';
import { useFirebase } from '../auth/FirebaseContext';

interface HeaderProps {
  student: StudentProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenKtmModal: () => void;
  onSelectTab: (tab: any) => void;
  activeTab: string;
  onOpenNusaAI?: () => void;
  activeCampusId?: string;
  onCampusChange?: (campusId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  unreadCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenKtmModal,
  onSelectTab,
  activeTab,
  onOpenNusaAI,
  activeCampusId,
  onCampusChange,
}) => {
  const { showToast } = useToast();
  const { branding } = useFirebase();

  const [selectedCampus, setSelectedCampus] = useState(
    MOCK_CAMPUSES.find((c) => c.campusId === activeCampusId || c.id === activeCampusId) || MOCK_CAMPUSES[0]
  );
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);

  useEffect(() => {
    if (activeCampusId) {
      const match = MOCK_CAMPUSES.find((c) => c.campusId === activeCampusId || c.id === activeCampusId);
      if (match) {
        setSelectedCampus(match);
      }
    }
  }, [activeCampusId]);

  const handleSelectCampus = (campus: typeof MOCK_CAMPUSES[0]) => {
    setSelectedCampus(campus);
    setIsCampusDropdownOpen(false);
    if (onCampusChange) {
      onCampusChange(campus.campusId);
    }
    showToast(`Beralih ke branding: ${campus.appName || campus.name}`, 'info');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Brand / Logo & Campus Indicator */}
        <div className="flex items-center gap-2.5">
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            {/* Dynamic Campus Logo */}
            <div 
              className="w-9 h-9 rounded-xl p-[1px] shadow-md group-hover:scale-105 transition-transform duration-200 overflow-hidden flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${branding.primaryColor || '#4f46e5'}, ${branding.secondaryColor || '#06b6d4'})`
              }}
            >
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center overflow-hidden">
                {branding.logo ? (
                  <img 
                    src={branding.logo} 
                    alt={branding.appName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <GraduationCap className="w-5 h-5" style={{ color: branding.primaryColor || '#4f46e5' }} />
                )}
              </div>
            </div>

            <div>
              {/* Dynamic App Name */}
              <div className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1">
                <span className="truncate max-w-[140px] sm:max-w-[200px]" style={{ color: branding.primaryColor || '#1e1b4b' }}>
                  {branding.appName || 'NusaCampus'}
                </span>
              </div>
              
              {/* Campus Selector Toggle Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCampusDropdownOpen(!isCampusDropdownOpen)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-600 font-semibold transition-colors cursor-pointer"
                >
                  <MapPin className="w-2.5 h-2.5" style={{ color: branding.primaryColor || '#4f46e5' }} />
                  <span className="truncate max-w-[120px] sm:max-w-[170px]">{branding.name || selectedCampus.name}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {/* Multi-Campus Dropdown Menu */}
                {isCampusDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Pilih Identitas Kampus
                    </p>
                    <div className="space-y-1">
                      {MOCK_CAMPUSES.map((campus) => {
                        const isSelected = selectedCampus.campusId === campus.campusId || selectedCampus.id === campus.campusId;
                        return (
                          <button
                            key={campus.campusId}
                            type="button"
                            onClick={() => handleSelectCampus(campus)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-200/60'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-left">
                              <img src={campus.logo} alt={campus.name} className="w-6 h-6 rounded-lg object-cover border border-slate-200 shrink-0" />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold leading-snug">{campus.appName}</p>
                                <span className="text-[10px] text-slate-400 block truncate">{campus.name}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* NusaAI Assistant Launcher */}
          {onOpenNusaAI && (
            <button
              onClick={onOpenNusaAI}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
              style={{
                borderColor: `${branding.primaryColor || '#4f46e5'}40`,
                backgroundColor: `${branding.primaryColor || '#4f46e5'}10`,
                color: branding.primaryColor || '#4f46e5',
              }}
              aria-label="Tanya NusaAI"
              title="Tanya NusaAI Assistant"
            >
              <Bot className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline text-[11px]">NusaAI</span>
            </button>
          )}

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Cari Mata Kuliah, Tugas, atau Pengumuman"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative active:scale-95 transition-all cursor-pointer"
            aria-label="Notifikasi Kampus"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* User Digital KTM Avatar */}
          <button
            onClick={onOpenKtmModal}
            className="ml-1 pl-1 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            title="Buka KTM Digital"
          >
            <div className="w-8 h-8 rounded-xl ring-2 overflow-hidden bg-slate-100 flex items-center justify-center shadow-xs transition-all"
                 style={{ borderColor: `${branding.primaryColor || '#4f46e5'}40` }}>
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
