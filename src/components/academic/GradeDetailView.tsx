import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, Calculator, Info, FileSpreadsheet } from 'lucide-react';
import { CourseGradeDetail } from '../../types';
import { MOCK_GRADE_DETAILS } from '../../data/mockData';

export const GradeDetailView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseGradeDetail>(MOCK_GRADE_DETAILS[0]);

  const gradeScales = [
    { letter: 'A', min: 85, point: '4.00', pred: 'Sangat Baik' },
    { letter: 'A-', min: 80, point: '3.75', pred: 'Hampir Sangat Baik' },
    { letter: 'B+', min: 75, point: '3.50', pred: 'Baik Sekali' },
    { letter: 'B', min: 70, point: '3.00', pred: 'Baik' },
    { letter: 'B-', min: 65, point: '2.75', pred: 'Cukup Baik' },
    { letter: 'C+', min: 60, point: '2.50', pred: 'Lebih Dari Cukup' },
    { letter: 'C', min: 55, point: '2.00', pred: 'Cukup' },
  ];

  return (
    <div className="space-y-4">
      {/* Course Selection Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {MOCK_GRADE_DETAILS.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCourse.id === course.id
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 border border-indigo-500'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="font-mono">{course.courseCode}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-cyan-300 font-bold">{course.letterGrade}</span>
          </button>
        ))}
      </div>

      {/* Selected Course Final Score Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span>{selectedCourse.courseCode}</span>
              <span>·</span>
              <span>{selectedCourse.sks} SKS</span>
              <span>·</span>
              <span>Semester {selectedCourse.semester}</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              {selectedCourse.courseName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Dosen: {selectedCourse.lecturer}</p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex flex-col items-center justify-center shrink-0">
            <span className="text-2xl font-black text-cyan-300 font-mono leading-none">
              {selectedCourse.letterGrade}
            </span>
            <span className="text-[10px] text-slate-300 font-mono mt-0.5">
              {selectedCourse.gradePoint.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Nilai Akhir Terakumulasi</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">
              {selectedCourse.finalScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Status Kelulusan Matkul</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Lulus Memenuhi Syarat
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Komponen Nilai Table */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            Komposisi Bobot & Nilai Komponen
          </h4>
          <span className="text-[10px] text-slate-400">Total Bobot: 100%</span>
        </div>

        <div className="space-y-2">
          {selectedCourse.components.map((comp, idx) => {
            const contribution = (comp.score * comp.weight) / 100;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{comp.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">Bobot {comp.weight}%</span>
                    <span className="text-white font-bold">{comp.score}</span>
                  </div>
                </div>

                {/* Progress bar of score */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Kontribusi ke Nilai Akhir:</span>
                  <span className="font-mono text-cyan-300 font-medium">+{contribution.toFixed(2)} poin</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skala Penilaian Standar Kampus */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2.5">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Standar Konversi Nilai Mutu Universitas
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {gradeScales.map((scale) => (
            <div
              key={scale.letter}
              className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center font-bold text-cyan-300 font-mono text-xs">
                  {scale.letter}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">≥ {scale.min}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{scale.point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
