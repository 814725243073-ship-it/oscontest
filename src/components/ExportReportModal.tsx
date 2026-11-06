/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FileDown, CheckCircle2, Award, Printer, BarChart3, Table, FileText, Check } from 'lucide-react';
import { ScheduledJob, GanttBlock, SchedulerMetrics } from '../types/scheduler';
import { generateAcademicPDFReport, PDFExportOptions } from '../utils/pdfExport';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledJobs: ScheduledJob[];
  ganttBlocks: GanttBlock[];
  metrics: SchedulerMetrics;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  scheduledJobs,
  ganttBlocks,
  metrics,
}) => {
  const [registerNo, setRegisterNo] = useState('814725243073');
  const [candidateName, setCandidateName] = useState('Operating Systems Student');
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [includeConvoyNotes, setIncludeConvoyNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      const options: PDFExportOptions = {
        registerNumber: registerNo.trim() || '814725243073',
        studentName: candidateName.trim() || 'Student Submitter',
        courseCode: 'CS25C11 Operating Systems',
        contestTitle: 'Kernel Wars OS Contest',
        includeFormulas,
        includeConvoyNotes,
      };

      generateAcademicPDFReport(scheduledJobs, ganttBlocks, metrics, options);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Export Academic PDF Report</h3>
              <p className="text-xs text-slate-300">
                Official Submission Document for CS25C11 Operating Systems Lab & Kernel Wars
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
        <div className="p-6 space-y-5 text-slate-700 text-sm">
          {/* Success Banner */}
          {exportSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                PDF successfully generated and downloaded as{' '}
                <strong>FCFS_Scheduler_Report_{registerNo}.pdf</strong>!
              </span>
            </div>
          )}

          {/* Submission Metadata Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>Candidate & Course Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Register Number
                </label>
                <input
                  type="text"
                  value={registerNo}
                  onChange={(e) => setRegisterNo(e.target.value)}
                  placeholder="814725243073"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono font-bold text-teal-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate / Student Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Student Submitter"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Course: <strong>CS25C11 Operating Systems</strong></span>
              <span>·</span>
              <span>Contest: <strong>Kernel Wars</strong></span>
            </div>
          </div>

          {/* Report Inclusions Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Report Inclusions
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="w-4 h-4 text-teal-600 rounded-sm accent-teal-600"
                />
                <span className="flex-1 font-medium text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Vector Gantt Timeline Chart with colored job blocks & idle intervals</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Required</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="w-4 h-4 text-teal-600 rounded-sm accent-teal-600"
                />
                <span className="flex-1 font-medium text-slate-800 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-teal-600" />
                  <span>Detailed Results Table (AT, BT, ST, CT, TAT, WT + Averages row)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Required</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={includeFormulas}
                  onChange={(e) => setIncludeFormulas(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded-sm accent-teal-600"
                />
                <span className="flex-1 font-medium text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Mathematical Viva Formulas (ST, CT, TAT, WT, ATT, AWT definitions)</span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={includeConvoyNotes}
                  onChange={(e) => setIncludeConvoyNotes(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded-sm accent-teal-600"
                />
                <span className="flex-1 font-medium text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Convoy Effect Analysis & Examiner Signature / Marking block</span>
                </span>
              </label>
            </div>
          </div>

          {/* Quick Metrics Preview */}
          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs">
            <span className="font-bold text-teal-900 block mb-1">
              Current Dataset Summary ({metrics.totalJobs} Jobs):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-teal-800 mt-2">
              <div className="p-1.5 bg-white rounded border border-teal-100">
                AWT: <strong>{metrics.averageWaitingTime}u</strong>
              </div>
              <div className="p-1.5 bg-white rounded border border-teal-100">
                ATT: <strong>{metrics.averageTurnaroundTime}u</strong>
              </div>
              <div className="p-1.5 bg-white rounded border border-teal-100">
                Makespan: <strong>{metrics.totalTime}u</strong>
              </div>
              <div className="p-1.5 bg-white rounded border border-teal-100">
                Utilization: <strong>{metrics.printerUtilization}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Output: FCFS_Scheduler_Report_{registerNo}.pdf
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || scheduledJobs.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Academic PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
