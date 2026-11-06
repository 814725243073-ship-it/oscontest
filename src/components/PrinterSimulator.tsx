/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ScheduledJob, SchedulerMetrics } from '../types/scheduler';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Printer,
  FileText,
  Clock,
  CheckCircle,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface PrinterSimulatorProps {
  scheduledJobs: ScheduledJob[];
  metrics: SchedulerMetrics;
  virtualClock: number;
  setVirtualClock: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  speedMs: number;
  setSpeedMs: React.Dispatch<React.SetStateAction<number>>;
}

export const PrinterSimulator: React.FC<PrinterSimulatorProps> = ({
  scheduledJobs,
  metrics,
  virtualClock,
  setVirtualClock,
  isPlaying,
  setIsPlaying,
  speedMs,
  setSpeedMs,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-tick virtual clock when playing
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setVirtualClock((prev) => {
          if (prev >= metrics.totalTime) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, metrics.totalTime, speedMs, setIsPlaying, setVirtualClock]);

  // Determine current system state at time `virtualClock`
  // 1. Currently printing job: scheduledJob with startTime <= virtualClock < completionTime
  const activeJob = scheduledJobs.find(
    (job) => job.startTime <= virtualClock && virtualClock < job.completionTime
  );

  // 2. Waiting queue: arrived at or before virtualClock, but not started yet (virtualClock < startTime)
  const waitingQueue = scheduledJobs.filter(
    (job) => job.arrivalTime <= virtualClock && virtualClock < job.startTime
  );

  // 3. Upcoming jobs: haven't arrived yet (arrivalTime > virtualClock)
  const upcomingJobs = scheduledJobs.filter((job) => job.arrivalTime > virtualClock);

  // 4. Completed jobs: finished at or before virtualClock (completionTime <= virtualClock)
  const completedJobs = scheduledJobs.filter((job) => job.completionTime <= virtualClock);

  // Progress of active job
  const activeProgress = activeJob
    ? Math.min(
        100,
        Math.round(((virtualClock - activeJob.startTime) / activeJob.burstTime) * 100)
      )
    : 0;

  const handleStartOrResume = () => {
    if (virtualClock >= metrics.totalTime) {
      setVirtualClock(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setVirtualClock(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setVirtualClock((prev) => Math.min(metrics.totalTime, prev + 1));
  };

  const isCompleted = metrics.totalTime > 0 && virtualClock >= metrics.totalTime;
  const isIdle = !activeJob && !isCompleted && scheduledJobs.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      {/* Simulation Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-teal-600" />
              <span>Animated Virtual Printer Simulator</span>
            </h2>
            {/* Status Pill */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : activeJob
                  ? 'bg-teal-50 text-teal-700 border-teal-200 animate-pulse'
                  : isIdle
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {isCompleted
                ? 'All Jobs Printed'
                : activeJob
                ? `Printing ${activeJob.id}`
                : isIdle
                ? 'Printer Idle (Awaiting Arrival)'
                : 'Standby'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step queue dispatcher moving print jobs from spool to physical tray.
          </p>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Virtual Clock Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg shadow-xs font-mono text-xs font-bold tabular-nums">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Clock: t = {virtualClock}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handleStartOrResume}
                disabled={scheduledJobs.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{virtualClock > 0 && !isCompleted ? 'Resume' : 'Start Simulation'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStepForward}
              disabled={isCompleted || scheduledJobs.length === 0}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
              title="Advance virtual clock by 1 tick"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+1 Step</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={virtualClock === 0}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
              title="Reset Clock to t = 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector Slider */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-600">Speed:</span>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={2200 - speedMs}
              onChange={(e) => setSpeedMs(2200 - Number(e.target.value))}
              className="w-20 accent-teal-600 cursor-pointer"
              title={`Delay: ${speedMs}ms per tick`}
            />
            <span className="font-mono text-[10px] text-slate-500 tabular-nums w-8">
              {(1000 / speedMs).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* 3-Stage Visual Sandbox Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stage 1: Waiting Spool Queue (Left Column, 4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Waiting Queue ({waitingQueue.length})</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">FIFO Order</span>
            </div>

            {waitingQueue.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs italic">
                  {upcomingJobs.length > 0
                    ? `No jobs in queue yet. ${upcomingJobs.length} job(s) arriving soon.`
                    : 'Queue is empty.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {waitingQueue.map((job, idx) => (
                  <div
                    key={job.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold font-mono"
                        style={{ backgroundColor: job.color }}
                      >
                        {job.id}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                          {job.documentName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Arrived: t={job.arrivalTime} · Wait: {virtualClock - job.arrivalTime}u
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-medium rounded">
                        {job.burstTime}u burst
                      </span>
                      {idx === 0 && (
                        <span className="block text-[9px] font-bold text-teal-600 uppercase mt-0.5">
                          Next in line
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Preview Strip */}
          {upcomingJobs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Upcoming Arrivals ({upcomingJobs.length})
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {upcomingJobs.map((j) => (
                  <span
                    key={j.id}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono"
                  >
                    {j.id} (t={j.arrivalTime})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stage 2: The Shared Physical Printer (Center Column, 4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-teal-50/50 to-sky-50/30 rounded-xl p-4 border border-teal-200 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
          {/* Printer Machine Illustration & Active Job */}
          <div className="w-full flex flex-col items-center text-center">
            {/* Animated Printer Device Box */}
            <div className="relative mb-3">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                  activeJob
                    ? 'bg-teal-600 shadow-teal-500/20 scale-105 ring-4 ring-teal-200'
                    : isIdle
                    ? 'bg-slate-400 shadow-slate-300/20'
                    : 'bg-emerald-600 shadow-emerald-500/20'
                }`}
              >
                <Printer
                  className={`w-10 h-10 ${
                    activeJob ? 'animate-bounce' : ''
                  }`}
                />
              </div>

              {/* Animated Paper Sheet feeding out of printer */}
              {activeJob && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-white border border-slate-300 rounded-b shadow-xs animate-print-feed flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-slate-300" />
                </div>
              )}
            </div>

            {/* Current Printer Status Text */}
            {activeJob ? (
              <div className="w-full max-w-xs mt-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-900">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: activeJob.color }}
                  />
                  <span>
                    {activeJob.id}: {activeJob.documentName}
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 font-mono mt-0.5">
                  Page {virtualClock - activeJob.startTime + 1} of {activeJob.burstTime} (
                  {activeProgress}%)
                </div>

                {/* Live Progress Bar */}
                <div className="w-full bg-teal-100 rounded-full h-2.5 mt-2 overflow-hidden border border-teal-200">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
              </div>
            ) : isIdle ? (
              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-slate-700">Printer Idle</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Waiting for document to arrive...
                </p>
              </div>
            ) : isCompleted ? (
              <div className="mt-2 text-center text-emerald-700">
                <CheckCircle className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <p className="text-xs font-bold">All Jobs Dispatched</p>
                <p className="text-[11px] text-emerald-600">
                  Finished at t = {metrics.totalTime} units
                </p>
              </div>
            ) : (
              <div className="mt-2 text-center text-slate-500 text-xs">
                Press "Start Simulation" to begin
              </div>
            )}
          </div>
        </div>

        {/* Stage 3: Output Tray / Completed Jobs (Right Column, 4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Output Tray ({completedJobs.length})</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Finished Documents</span>
            </div>

            {completedJobs.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs italic">No documents printed yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                {completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold font-mono"
                        style={{ backgroundColor: job.color }}
                      >
                        {job.id}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
                          {job.documentName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Completed at t = {job.completionTime}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-mono text-slate-600">
                      <div>TAT: {job.turnaroundTime}u</div>
                      <div className="text-slate-400">WT: {job.waitingTime}u</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Progress Bar for overall completion */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
              <span>Overall Schedule Progress</span>
              <span className="font-mono">
                {completedJobs.length} / {scheduledJobs.length} Jobs
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    scheduledJobs.length > 0
                      ? (completedJobs.length / scheduledJobs.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
