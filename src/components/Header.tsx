/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, BookOpen, Sparkles, FileDown } from 'lucide-react';

interface HeaderProps {
  onOpenTheory: () => void;
  onOpenConvoyModal: () => void;
  onExportPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTheory,
  onOpenConvoyModal,
  onExportPDF,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Printing Service Scheduler – FCFS
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                Non-Preemptive
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>CS25C11 Operating Systems</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 font-semibold">Kernel Wars</span>
              <span aria-hidden="true">·</span>
              <span>First-Come, First-Served CPU & I/O Model</span>
            </p>
          </div>
        </div>

        {/* Quick Theory & Action Triggers */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Export official academic PDF submission report"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={onOpenConvoyModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            title="Inspect Convoy Effect Demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Convoy Effect Lab</span>
          </button>

          <button
            type="button"
            onClick={onOpenTheory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Formulas & Theory</span>
          </button>
        </div>
      </div>
    </header>
  );
};
