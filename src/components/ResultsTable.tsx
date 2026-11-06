/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScheduledJob, SchedulerMetrics } from '../types/scheduler';
import { Table, CheckCircle2, TrendingUp, Clock, Hourglass, Percent, Activity, FileDown } from 'lucide-react';

interface ResultsTableProps {
  scheduledJobs: ScheduledJob[];
  metrics: SchedulerMetrics;
  onExportPDF?: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ scheduledJobs, metrics, onExportPDF }) => {
  if (scheduledJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Average Waiting Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Waiting Time (AWT)
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.averageWaitingTime}
            </span>
            <span className="text-xs font-medium text-slate-500">units</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Σ WT / {metrics.totalJobs} = {metrics.averageWaitingTime}
          </p>
        </div>

        {/* Average Turnaround Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Turnaround (ATT)
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.averageTurnaroundTime}
            </span>
            <span className="text-xs font-medium text-slate-500">units</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Σ TAT / {metrics.totalJobs} = {metrics.averageTurnaroundTime}
          </p>
        </div>

        {/* Printer Utilization */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Printer Utilization
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.printerUtilization}%
            </span>
            <span className="text-xs font-medium text-slate-500">active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Busy: {metrics.totalBurst}u / Total: {metrics.totalTime}u
          </p>
        </div>

        {/* Total Makespan / Throughput */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Makespan
            </span>
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.totalTime}
            </span>
            <span className="text-xs font-medium text-slate-500">units</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Throughput: {metrics.throughput} jobs/unit
          </p>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-teal-600" />
              <span>FCFS Scheduling Detailed Results Table</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact job timeline calculations in arrival order (FIFO execution sequence).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden md:inline-block text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Formulas: <strong>TAT = CT − AT</strong> · <strong>WT = TAT − BT</strong>
            </div>

            {onExportPDF && (
              <button
                type="button"
                onClick={onExportPDF}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Export results table and Gantt chart summary to PDF report"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Academic PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-3.5 w-16">Job</th>
                <th className="py-3 px-3.5">Document</th>
                <th className="py-3 px-3.5 text-right">Arrival Time (AT)</th>
                <th className="py-3 px-3.5 text-right">Burst / Print (BT)</th>
                <th className="py-3 px-3.5 text-right bg-teal-50/50">Start Time (ST)</th>
                <th className="py-3 px-3.5 text-right bg-teal-50/50">Completion (CT)</th>
                <th className="py-3 px-3.5 text-right bg-sky-50/50">Turnaround (TAT)</th>
                <th className="py-3 px-3.5 text-right bg-amber-50/50 font-bold">Waiting Time (WT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {scheduledJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: job.color }}
                      />
                      <span>{job.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 font-sans font-medium text-slate-900">
                    {job.documentName}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums text-slate-700">
                    {job.arrivalTime}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums text-slate-700">
                    {job.burstTime}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-semibold text-teal-800 bg-teal-50/20">
                    {job.startTime}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-semibold text-teal-800 bg-teal-50/20">
                    {job.completionTime}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-semibold text-sky-800 bg-sky-50/20">
                    {job.turnaroundTime}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-bold text-amber-800 bg-amber-50/20">
                    {job.waitingTime}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Averages Summary Footer Row */}
            <tfoot>
              <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-bold text-slate-900">
                <td colSpan={2} className="py-3 px-3.5 font-sans text-xs uppercase tracking-wider text-slate-700">
                  Average Metrics
                </td>
                <td className="py-3 px-3.5 text-right text-slate-400 font-mono">—</td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-800 tabular-nums">
                  Total: {metrics.totalBurst}
                </td>
                <td className="py-3 px-3.5 text-right text-slate-400 font-mono">—</td>
                <td className="py-3 px-3.5 text-right font-mono text-teal-900 tabular-nums">
                  End: {metrics.totalTime}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-sky-900 tabular-nums bg-sky-100/50">
                  ATT = {metrics.averageTurnaroundTime}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-amber-900 tabular-nums bg-amber-100/50">
                  AWT = {metrics.averageWaitingTime}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
