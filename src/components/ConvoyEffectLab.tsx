/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { PrintJobInput } from '../types/scheduler';
import { calculateFCFS, SAMPLE_JOBS } from '../utils/fcfsAlgorithm';

interface ConvoyEffectLabProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBenchmark?: (jobs: PrintJobInput[]) => void;
}

export const ConvoyEffectLab: React.FC<ConvoyEffectLabProps> = ({
  isOpen,
  onClose,
  onApplyBenchmark,
}) => {
  if (!isOpen) return null;

  // Case A: Default FCFS Order with Photo.png (Burst 8) arriving at t=2
  const caseA_Jobs = [...SAMPLE_JOBS];
  const resultA = calculateFCFS(caseA_Jobs);

  // Case B: Convoy-Mitigated Order (SJF preference: Shortest jobs scheduled first)
  // Resume (3) -> Report (5) -> Notes (6) -> Photo (8)
  const caseB_Jobs: PrintJobInput[] = [
    { ...caseA_Jobs[1], arrivalTime: 0 }, // Resume.doc (3)
    { ...caseA_Jobs[0], arrivalTime: 1 }, // Report.pdf (5)
    { ...caseA_Jobs[3], arrivalTime: 2 }, // Notes.txt (6)
    { ...caseA_Jobs[2], arrivalTime: 3 }, // Photo.png (8)
  ];
  const resultB = calculateFCFS(caseB_Jobs);

  const diffAWT = Number((resultA.metrics.averageWaitingTime - resultB.metrics.averageWaitingTime).toFixed(2));
  const percentSaved = Math.round((diffAWT / resultA.metrics.averageWaitingTime) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Convoy Effect Laboratory</h3>
              <p className="text-xs text-amber-100">
                Interactive Proof: How Long Burst Times Degrade Average Waiting Time in FCFS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-100 hover:text-white hover:bg-amber-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700 text-sm">
          {/* Key Insight Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                What is the Convoy Effect?
              </h4>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                In non-preemptive FCFS, when a long CPU/print-bound process (like <strong>Photo.png with 8 burst units</strong>)
                executes, all subsequent lightweight jobs must sit idle in the waiting queue.
                This creates a "convoy" of blocked processes, dramatically inflating the <strong>Average Waiting Time (AWT)</strong>.
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case A: Standard FCFS Order */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Case A: Standard FCFS Order
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Unmitigated Convoy</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Photo.png (8u) arrives at t=2 and blocks Notes.txt (6u) for 13 time units.
                </p>

                {/* Mini Gantt */}
                <div className="h-10 flex rounded-md overflow-hidden border border-slate-300 text-[10px] font-bold text-white mb-2">
                  {resultA.ganttBlocks.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${(b.duration / resultA.metrics.totalTime) * 100}%`,
                        backgroundColor: b.color || '#94a3b8',
                      }}
                      className="h-full flex items-center justify-center truncate px-1"
                      title={`${b.jobId} (${b.duration}u)`}
                    >
                      {b.jobId} ({b.duration}u)
                    </div>
                  ))}
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Average Waiting Time (AWT):</span>
                    <strong className="text-rose-600">{resultA.metrics.averageWaitingTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Turnaround (ATT):</span>
                    <strong className="text-slate-800">{resultA.metrics.averageTurnaroundTime} units</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Case B: Optimal / SJF Reordered */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Case B: Convoy-Mitigated Order
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700">Short Jobs First</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Light jobs (Resume 3u, Report 5u) clear the printer before Photo (8u) begins.
                </p>

                {/* Mini Gantt */}
                <div className="h-10 flex rounded-md overflow-hidden border border-emerald-300 text-[10px] font-bold text-white mb-2">
                  {resultB.ganttBlocks.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${(b.duration / resultB.metrics.totalTime) * 100}%`,
                        backgroundColor: b.color || '#94a3b8',
                      }}
                      className="h-full flex items-center justify-center truncate px-1"
                      title={`${b.jobId} (${b.duration}u)`}
                    >
                      {b.jobId} ({b.duration}u)
                    </div>
                  ))}
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-600 pt-2 border-t border-emerald-200">
                  <div className="flex justify-between">
                    <span>Average Waiting Time (AWT):</span>
                    <strong className="text-emerald-700">{resultB.metrics.averageWaitingTime} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Turnaround (ATT):</span>
                    <strong className="text-slate-800">{resultB.metrics.averageTurnaroundTime} units</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantitative Performance Improvement Card */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-900 block">
                  AWT Reduced by {diffAWT} units ({percentSaved}% faster queue clearance!)
                </span>
                <span className="text-[11px] text-teal-700">
                  Total makespan remains identical ({resultA.metrics.totalTime} units), but user perception of responsiveness improves dramatically.
                </span>
              </div>
            </div>

            {onApplyBenchmark && (
              <button
                type="button"
                onClick={() => {
                  onApplyBenchmark(caseB_Jobs);
                  onClose();
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Load Mitigated Dataset
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
