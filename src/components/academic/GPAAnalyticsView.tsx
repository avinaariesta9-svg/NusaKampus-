import React, { useState } from 'react';
import { TrendingUp, Award, Calculator, Target, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { MOCK_IPK_PROGRESSION } from '../../data/mockData';

export const GPAAnalyticsView: React.FC = () => {
  const [targetGPA, setTargetGPA] = useState<number>(3.88);
  const currentIPK = 3.86;
  const completedSks = 114;
  const totalTargetSks = 144;
  const remainingSks = totalTargetSks - completedSks; // 30 SKS (e.g. 2 semesters)

  // Formula: TargetIPK = (CurrentIPK * completedSks + requiredIPS * remainingSks) / totalTargetSks
  // requiredIPS = (targetGPA * totalTargetSks - currentIPK * completedSks) / remainingSks
  const requiredAverageIPS = (targetGPA * totalTargetSks - currentIPK * completedSks) / remainingSks;

  const maxGPA = 4.0;

  return (
    <div className="space-y-4">
      {/* Cumulative IPK Overview Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-cyan-950/40 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisis Performa Indeks Prestasi</span>
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-1">
              IPK {currentIPK.toFixed(2)}
            </h3>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Predikat: Dengan Pujian (Cumlaude)
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Total SKS Diperoleh</span>
            <span className="text-lg font-bold text-white font-mono">{completedSks}</span>
            <span className="text-xs text-slate-400 font-mono"> / {totalTargetSks} SKS</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Perjalanan Menuju Kelulusan Sarjana</span>
            <span className="font-mono text-cyan-400 font-semibold">
              {Math.round((completedSks / totalTargetSks) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedSks / totalTargetSks) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Semester Trend Chart */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Grafik Tren IPS & IPK per Semester
          </h4>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> IPS
            </span>
            <span className="flex items-center gap-1 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> IPK Kumulatif
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4 pb-2 px-2">
          <div className="grid grid-cols-6 gap-2 items-end h-40 border-b border-slate-800 pb-2">
            {MOCK_IPK_PROGRESSION.map((item) => {
              const heightPercent = ((item.ips - 2.5) / (maxGPA - 2.5)) * 100;
              return (
                <div key={item.semester} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.ips.toFixed(2)}
                  </span>
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    {/* IPS Bar */}
                    <div
                      className={`w-3.5 rounded-t-md transition-all duration-300 group-hover:brightness-125 ${
                        item.isEstimate
                          ? 'bg-indigo-500/40 border border-dashed border-indigo-400'
                          : 'bg-gradient-to-t from-indigo-700 to-indigo-500'
                      }`}
                      style={{ height: `${Math.max(15, heightPercent)}%` }}
                    />
                    {/* IPK Indicator Line / Mini Bar */}
                    <div
                      className="w-1.5 bg-cyan-400 rounded-t-sm"
                      style={{ height: `${Math.max(15, ((item.ipk - 2.5) / (maxGPA - 2.5)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    S{item.semester}{item.isEstimate ? '*' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-right">
            * Semester 6 adalah estimasi berjalan
          </p>
        </div>

        {/* Tabular Numerals Detail */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {MOCK_IPK_PROGRESSION.map((p) => (
            <div
              key={p.semester}
              className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Semester {p.semester}</span>
                {p.isEstimate && (
                  <span className="text-[10px] text-cyan-400 font-medium">(Berjalan)</span>
                )}
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-slate-400">{p.sks} SKS</span>
                <span className="text-indigo-300">IPS: {p.ips.toFixed(2)}</span>
                <span className="text-cyan-400 font-bold">IPK: {p.ipk.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target GPA Simulator */}
      <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Kalkulator Simulasi Target IPK Wisuda
          </h4>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Tentukan target IPK kelulusan Anda untuk menghitung minimal IPS rata-rata yang harus diraih pada sisa {remainingSks} SKS (Semester 7 & 8).
        </p>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Target IPK Kelulusan:</span>
            <span className="text-base font-black text-white font-mono">{targetGPA.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="3.50"
            max="4.00"
            step="0.01"
            value={targetGPA}
            onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>3.50 (Cumlaude Min)</span>
            <span>3.75</span>
            <span>4.00 (Sempurna)</span>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Target Rata-Rata IPS Dibutuhkan</span>
            <span className="text-lg font-bold text-cyan-300 font-mono mt-0.5 block">
              {requiredAverageIPS > 4.0 ? '> 4.00 (Tidak Tercapai)' : `${requiredAverageIPS.toFixed(2)} IPS`}
            </span>
          </div>

          <div className="text-right">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              requiredAverageIPS <= 4.0 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
            }`}>
              {requiredAverageIPS <= 4.0 ? 'Sangat Realistis' : 'Melebihi Kuota Maks'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
