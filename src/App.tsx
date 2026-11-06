/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PrintJobInput } from './types/scheduler';
import { calculateFCFS, SAMPLE_JOBS } from './utils/fcfsAlgorithm';
import { Header } from './components/Header';
import { JobInputForm } from './components/JobInputForm';
import { GanttChart } from './components/GanttChart';
import { PrinterSimulator } from './components/PrinterSimulator';
import { ResultsTable } from './components/ResultsTable';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ConvoyEffectLab } from './components/ConvoyEffectLab';
import { ExportReportModal } from './components/ExportReportModal';
import { Footer } from './components/Footer';
import { BookOpen, AlertTriangle, ArrowRight, Sparkles, HelpCircle, FileDown } from 'lucide-react';

export default function App() {
  // Master list of input jobs
  const [jobs, setJobs] = useState<PrintJobInput[]>(SAMPLE_JOBS);

  // Virtual clock and simulation state
  const [virtualClock, setVirtualClock] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);

  // Modals
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isConvoyLabOpen, setIsConvoyLabOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Run FCFS algorithm dynamically whenever jobs change
  const scheduleResult = useMemo(() => {
    return calculateFCFS(jobs);
  }, [jobs]);

  const { scheduledJobs, ganttBlocks, metrics } = scheduleResult;

  // Handlers
  const handleAddJob = (newJob: PrintJobInput) => {
    setJobs((prev) => [...prev, newJob]);
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleLoadSample = () => {
    setJobs([...SAMPLE_JOBS]);
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleReset = () => {
    setJobs([]);
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleApplyCustomSet = (newJobs: PrintJobInput[]) => {
    setJobs(newJobs);
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleSelectTime = (t: number) => {
    setIsPlaying(false);
    setVirtualClock(t);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header with Project Title, Course Code, and Quick Links */}
      <Header
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenConvoyModal={() => setIsConvoyLabOpen(true)}
        onExportPDF={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Hero Banner & Quick Stats */}
        <section className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 text-teal-300 text-xs font-semibold tracking-wider uppercase">
                <span>Kernel Wars Operating Systems Project</span>
                <span aria-hidden="true">·</span>
                <span>CS25C11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
                Shared Printing Service FCFS Scheduler
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Simulate non-preemptive <strong>First-Come, First-Served</strong> CPU & I/O
                spooling. Analyze execution timelines, calculate turnaround and waiting metrics, and
                investigate the Convoy Effect in shared print queues.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Export academic PDF report for laboratory submission"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Academic PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConvoyLabOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Test Convoy Effect</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTheoryOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Viva OS Formulas</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 1: Animated Interactive Printer Simulator */}
        <section aria-label="Printer Simulation">
          <PrinterSimulator
            scheduledJobs={scheduledJobs}
            metrics={metrics}
            virtualClock={virtualClock}
            setVirtualClock={setVirtualClock}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speedMs={speedMs}
            setSpeedMs={setSpeedMs}
          />
        </section>

        {/* Section 2: Proportional Gantt Timeline Chart */}
        <section aria-label="Gantt Timeline Chart">
          <GanttChart
            blocks={ganttBlocks}
            totalTime={metrics.totalTime}
            currentClock={virtualClock}
            onSelectTime={handleSelectTime}
          />
        </section>

        {/* Section 3: Job Input Configuration Form & Enqueued Jobs Table */}
        <section aria-label="Job Configuration Form">
          <JobInputForm
            jobs={jobs}
            onAddJob={handleAddJob}
            onDeleteJob={handleDeleteJob}
            onLoadSample={handleLoadSample}
            onReset={handleReset}
          />
        </section>

        {/* Section 4: Detailed Results Table & Averages */}
        <section aria-label="Detailed Results">
          <ResultsTable
            scheduledJobs={scheduledJobs}
            metrics={metrics}
            onExportPDF={() => setIsExportModalOpen(true)}
          />
        </section>

        {/* Section 5: "How It Works" & Convoy Effect Explanatory Section */}
        <section aria-label="How it works explanation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: FCFS Principle */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              1. Non-Preemptive FCFS Principle
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jobs are assigned the printer in strict order of arrival time (FIFO). Once printing
              starts, the document monopolizes the print head until its entire burst is completed.
              If no jobs exist, the printer remains idle.
            </p>
          </div>

          {/* Card 2: Core Viva Formulas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              2. Core Mathematical Formulas
            </h3>
            <div className="space-y-1 font-mono text-[11px] text-slate-600">
              <p>• <strong>Start:</strong> max(currentTime, Arrival)</p>
              <p>• <strong>Completion:</strong> Start + Burst</p>
              <p>• <strong>Turnaround:</strong> Completion − Arrival</p>
              <p>• <strong>Waiting:</strong> Turnaround − Burst</p>
            </div>
          </div>

          {/* Card 3: The Convoy Effect */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              3. The Convoy Effect Phenomenon
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              A single document with large burst (e.g. <em>Photo.png (8 units)</em>) forces shorter
              jobs behind it to suffer extreme wait times, dramatically increasing Average Waiting
              Time.
            </p>
            <button
              type="button"
              onClick={() => setIsConvoyLabOpen(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Convoy Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer with Register Number */}
      <Footer />

      {/* Theory & Formulas Modal */}
      <HowItWorksModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />

      {/* Convoy Effect Comparison Modal */}
      <ConvoyEffectLab
        isOpen={isConvoyLabOpen}
        onClose={() => setIsConvoyLabOpen(false)}
        onApplyBenchmark={handleApplyCustomSet}
      />

      {/* Academic PDF Report Export Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scheduledJobs={scheduledJobs}
        ganttBlocks={ganttBlocks}
        metrics={metrics}
      />
    </div>
  );
}
