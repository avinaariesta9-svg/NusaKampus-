/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingNusaAIButtonProps {
  onClick: () => void;
}

export const FloatingNusaAIButton: React.FC<FloatingNusaAIButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed right-4 bottom-20 sm:bottom-6 z-40 pointer-events-auto">
      <button
        type="button"
        onClick={onClick}
        aria-label="Tanya NusaAI"
        className="group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 backdrop-blur-md cursor-pointer"
      >
        {/* Animated Bot Avatar */}
        <div className="relative w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
          <Bot className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700 animate-pulse" />
        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black tracking-tight leading-none">NusaAI</span>
            <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
          </div>
          <span className="text-[10px] text-indigo-100 font-medium leading-none mt-0.5 hidden sm:inline">
            Tanya Kampus
          </span>
        </div>
      </button>
    </div>
  );
};
