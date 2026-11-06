/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrintJobInput } from '../types/scheduler';
import { SAMPLE_JOBS, JOB_COLORS, getFileExtensionType } from '../utils/fcfsAlgorithm';
import { Plus, RotateCcw, Database, Trash2, FileText, AlertCircle, Clock, Zap } from 'lucide-react';

interface JobInputFormProps {
  jobs: PrintJobInput[];
  onAddJob: (job: PrintJobInput) => void;
  onDeleteJob: (id: string) => void;
  onLoadSample: () => void;
  onReset: () => void;
}

export const JobInputForm: React.FC<JobInputFormProps> = ({
  jobs,
  onAddJob,
  onDeleteJob,
  onLoadSample,
  onReset,
}) => {
  const [documentName, setDocumentName] = useState('');
  const [arrivalTimeStr, setArrivalTimeStr] = useState('');
  const [burstTimeStr, setBurstTimeStr] = useState('');
  const [selectedColor, setSelectedColor] = useState(JOB_COLORS[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Suggest next ID based on existing jobs
  const getNextJobId = () => {
    const existingNums = jobs
      .map(j => parseInt(j.id.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : jobs.length + 1;
    return `J${nextNum}`;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = documentName.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter a document name (e.g., Thesis.pdf or Invoice.docx).');
      return;
    }

    const arrivalNum = Number(arrivalTimeStr);
    if (arrivalTimeStr.trim() === '' || isNaN(arrivalNum) || !Number.isInteger(arrivalNum) || arrivalNum < 0) {
      setErrorMessage('Arrival time must be an integer greater than or equal to 0 (t ≥ 0).');
      return;
    }

    const burstNum = Number(burstTimeStr);
    if (burstTimeStr.trim() === '' || isNaN(burstNum) || !Number.isInteger(burstNum) || burstNum < 1) {
      setErrorMessage('Print time / burst must be a positive integer greater than or equal to 1 page/unit (burst ≥ 1).');
      return;
    }

    const newJob: PrintJobInput = {
      id: getNextJobId(),
      documentName: trimmedName,
      arrivalTime: arrivalNum,
      burstTime: burstNum,
      color: selectedColor,
      fileType: getFileExtensionType(trimmedName),
    };

    onAddJob(newJob);

    // Reset input fields
    setDocumentName('');
    setArrivalTimeStr('');
    setBurstTimeStr('');
    // Cycle to next color
    const nextColorIndex = (JOB_COLORS.indexOf(selectedColor) + 1) % JOB_COLORS.length;
    setSelectedColor(JOB_COLORS[nextColorIndex]);
  };

  const handleQuickPreset = (name: string, defaultBurst: number) => {
    setDocumentName(name);
    if (!burstTimeStr) {
      setBurstTimeStr(String(defaultBurst));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Print Job Queue Input</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enqueue documents with arrival timestamps and printing durations.
          </p>
        </div>

        {/* Global Dataset Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Load Sample Data</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Clear all jobs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Add Job Form */}
      <form onSubmit={handleAddSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Document Name */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. LabReport.pdf, Thesis.docx"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-sans"
              />
            </div>
            {/* Quick Extension Presets */}
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
              <span>Quick add:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('Project.pdf', 4)}
                className="text-teal-600 hover:underline cursor-pointer"
              >
                Project.pdf
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('Slides.pptx', 6)}
                className="text-teal-600 hover:underline cursor-pointer"
              >
                Slides.pptx
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('Graph.png', 2)}
                className="text-teal-600 hover:underline cursor-pointer"
              >
                Graph.png
              </button>
            </div>
          </div>

          {/* Arrival Time */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Arrival Time (AT)</span>
              <span className="text-[10px] text-slate-400">t ≥ 0</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={arrivalTimeStr}
                onChange={(e) => setArrivalTimeStr(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Burst / Print Time */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Burst (BT)</span>
              <span className="text-[10px] text-slate-400">≥ 1 page</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={burstTimeStr}
                onChange={(e) => setBurstTimeStr(e.target.value)}
                placeholder="5"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Color & Submit Button */}
          <div className="md:col-span-2 flex flex-col justify-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-medium text-slate-500">Tag Color:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {JOB_COLORS.slice(0, 7).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
                title={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </form>

      {/* Table of Added Jobs */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Configured Print Queue ({jobs.length} {jobs.length === 1 ? 'job' : 'jobs'})
          </span>
          <span className="text-[11px] text-slate-400">
            Ordered by input sequence (FCFS sorts by arrival time automatically)
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No print jobs in the queue</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Add your custom documents above or click{' '}
              <button
                onClick={onLoadSample}
                className="text-teal-600 hover:text-teal-700 font-semibold underline cursor-pointer"
              >
                Load Sample Data
              </button>{' '}
              to load the Kernel Wars benchmark jobs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3 w-16">Job ID</th>
                  <th className="py-2.5 px-3">Document</th>
                  <th className="py-2.5 px-3 w-28 text-right">Arrival Time (AT)</th>
                  <th className="py-2.5 px-3 w-28 text-right">Burst / Print (BT)</th>
                  <th className="py-2.5 px-3 w-20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: job.color }}
                        />
                        <span>{job.id}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-none">{job.documentName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-700">
                      t = {job.arrivalTime}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-700">
                      {job.burstTime} {job.burstTime === 1 ? 'unit' : 'units'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title={`Remove ${job.id} (${job.documentName})`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
