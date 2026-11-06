/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Clock, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">How FCFS Scheduling Works</h3>
              <p className="text-xs text-slate-300">
                CS25C11 Operating Systems Theory & Viva Examination Reference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700 text-sm">
          {/* Section 1: Concept & Nature */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 font-mono text-xs flex items-center justify-center font-bold">
                01
              </span>
              <span>Algorithm Overview & Non-Preemptive Nature</span>
            </h4>
            <p className="leading-relaxed text-xs text-slate-600 pl-8">
              <strong>First-Come, First-Served (FCFS)</strong> is the simplest CPU and resource
              scheduling algorithm. Managed via a FIFO (First-In, First-Out) queue, the resource
              (in this simulation, the shared office printer) is allocated to jobs strictly in the
              order of their arrival.
            </p>
            <div className="mt-2.5 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-800 block">Non-Preemptive Execution</span>
                <span className="text-slate-500 text-[11px]">
                  Once the printer starts printing a document, it runs uninterrupted until completion.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-800 block">Idle State Handling</span>
                <span className="text-slate-500 text-[11px]">
                  If the queue is empty when previous jobs finish, the printer sleeps until the next arrival time.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Mathematical Formulas */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 font-mono text-xs flex items-center justify-center font-bold">
                02
              </span>
              <span>Mathematical Formulas (Viva-Ready)</span>
            </h4>
            <div className="pl-8 space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-teal-800 font-sans">Start Time (ST):</strong>
                  <code className="text-slate-800 ml-2">ST = max(Previous CT, Arrival Time)</code>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Printer clock when printing starts</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-teal-800 font-sans">Completion Time (CT):</strong>
                  <code className="text-slate-800 ml-2">CT = Start Time + Burst Time</code>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Time when job leaves the printer</span>
              </div>

              <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-sky-900 font-sans">Turnaround Time (TAT):</strong>
                  <code className="text-sky-900 ml-2 font-bold">TAT = Completion Time − Arrival Time</code>
                </div>
                <span className="text-[10px] text-sky-700 font-sans">Total time spent in system (wait + service)</span>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-amber-900 font-sans">Waiting Time (WT):</strong>
                  <code className="text-amber-900 ml-2 font-bold">WT = Turnaround Time − Burst Time</code>
                </div>
                <span className="text-[10px] text-amber-700 font-sans">Equivalent to: Start Time − Arrival Time</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-[11px]">
                <span>
                  <strong>Average Waiting Time (AWT):</strong> <code>AWT = (Σ WT) / n</code>
                </span>
                <span>
                  <strong>Average Turnaround (ATT):</strong> <code>ATT = (Σ TAT) / n</code>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: The Convoy Effect */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>The Convoy Effect in Operating Systems</span>
            </h4>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              The <strong>Convoy Effect</strong> is the primary weakness of FCFS scheduling. It
              occurs when a process with a large burst time (e.g., <strong>Photo.png with 8 burst units</strong>)
              holds the CPU or printer, forcing many smaller processes (like 1-unit or 3-unit jobs)
              to pile up in the waiting queue.
            </p>
            <div className="mt-3 p-3 bg-white/80 rounded-lg border border-amber-200/80 text-xs text-slate-700">
              <strong className="text-amber-900 block mb-1">Real-World Consequence:</strong>
              Average Waiting Time (AWT) shoots up significantly. If the long job were scheduled
              after the short jobs (as in Shortest Job First / SJF), average waiting time would decrease
              drastically and device utilization would feel much more responsive to users.
            </div>
          </div>

          {/* Section 4: Advantages & Disadvantages */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 font-mono text-xs flex items-center justify-center font-bold">
                03
              </span>
              <span>Trade-offs Summary</span>
            </h4>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Advantages
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Intuitive, fair, and deterministic order of service.</li>
                  <li>Zero starvation: every arrived job eventually runs.</li>
                  <li>Minimal scheduling overhead (simple FIFO queue).</li>
                </ul>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
                <span className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Disadvantages
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Non-preemptive: cannot fast-track high-priority emergency jobs.</li>
                  <li>Severe Convoy Effect on heterogeneous workloads.</li>
                  <li>High average waiting time compared to SJF or Round Robin.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
