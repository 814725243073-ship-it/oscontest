/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GanttBlock } from '../types/scheduler';
import { BarChart3, Clock, Info } from 'lucide-react';

interface GanttChartProps {
  blocks: GanttBlock[];
  totalTime: number;
  currentClock: number;
  onSelectTime?: (time: number) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  blocks,
  totalTime,
  currentClock,
  onSelectTime,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<GanttBlock | null>(null);

  if (blocks.length === 0 || totalTime === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-teal-600" />
          <span>FCFS Execution Gantt Chart</span>
        </h2>
        <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-sm font-medium">Add jobs to visualize the FCFS timeline schedule</p>
        </div>
      </div>
    );
  }

  // Calculate percentage width for each block based on total makespan
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>FCFS Execution Gantt Chart</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Proportional execution timeline with idle gap detection and start/end time boundaries.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block" />
            <span>Active Print Job</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-200 border border-slate-300 inline-block" />
            <span>Printer Idle State</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-200" />
            <span>Virtual Clock (t = {currentClock})</span>
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas */}
      <div className="relative pt-2 pb-6 overflow-x-auto">
        <div className="min-w-[550px] relative">
          {/* Gantt Bar Segments Container */}
          <div className="h-16 flex rounded-lg overflow-hidden border border-slate-300 shadow-inner bg-slate-100 relative">
            {blocks.map((block, index) => {
              const widthPercent = (block.duration / totalTime) * 100;
              const isIdle = block.type === 'idle';

              return (
                <div
                  key={`${block.startTime}-${block.endTime}-${index}`}
                  style={{ width: `${widthPercent}%` }}
                  onMouseEnter={() => setHoveredBlock(block)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  onClick={() => onSelectTime && onSelectTime(block.startTime)}
                  className={`h-full relative flex flex-col items-center justify-center transition-all cursor-pointer border-r border-white/40 last:border-r-0 select-none ${
                    isIdle
                      ? 'bg-slate-200/90 text-slate-600 pattern-diagonal hover:bg-slate-300'
                      : 'text-white hover:brightness-110 shadow-xs'
                  }`}
                  title={`${isIdle ? 'Printer Idle' : `${block.jobId}: ${block.documentName}`} (${block.startTime} → ${block.endTime})`}
                >
                  {/* Background Color for Active Job */}
                  {!isIdle && (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: block.color || '#0284c7' }}
                    />
                  )}

                  {/* Block Content */}
                  <div className="relative z-10 px-1 text-center w-full truncate">
                    {isIdle ? (
                      <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                        Idle
                      </span>
                    ) : (
                      <>
                        <div className="text-xs font-bold leading-tight truncate">
                          {block.jobId}
                        </div>
                        <div className="text-[10px] font-medium opacity-90 truncate max-w-full">
                          {block.documentName}
                        </div>
                      </>
                    )}
                    <span className="text-[9px] font-mono opacity-80 block">
                      ({block.duration}u)
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Virtual Clock Indicator Needle */}
            {currentClock <= totalTime && (
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-200 ease-out flex flex-col items-center"
                style={{
                  left: `${(currentClock / totalTime) * 100}%`,
                }}
              >
                <div className="w-1 h-full bg-rose-500 shadow-md" />
                <div className="w-2.5 h-2.5 bg-rose-600 rounded-full -mt-1 shadow-xs ring-2 ring-white" />
              </div>
            )}
          </div>

          {/* Time Marker Scale (Ticks under the bar) */}
          <div className="relative h-6 mt-1">
            {/* Start marker at 0 */}
            <div className="absolute left-0 top-0 -translate-x-1/2 flex flex-col items-center">
              <div className="h-2 w-px bg-slate-400" />
              <span className="text-[11px] font-mono font-semibold text-slate-700">0</span>
            </div>

            {/* End marker for each block */}
            {blocks.map((block, idx) => {
              const positionPercent = (block.endTime / totalTime) * 100;
              return (
                <div
                  key={`marker-${idx}-${block.endTime}`}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${positionPercent}%` }}
                >
                  <div className="h-2 w-px bg-slate-400" />
                  <span className="text-[11px] font-mono font-semibold text-slate-700">
                    {block.endTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover Info Drawer / Tooltip Card */}
      {hoveredBlock && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            {hoveredBlock.type === 'idle' ? (
              <span className="font-semibold text-slate-700">
                Printer Idle Gap: t = {hoveredBlock.startTime} to t = {hoveredBlock.endTime} (Duration: {hoveredBlock.duration} time units waiting for next arrival)
              </span>
            ) : (
              <div>
                <span className="font-bold text-slate-900">{hoveredBlock.jobId}: {hoveredBlock.documentName}</span>
                <span className="text-slate-500 ml-2">
                  Started at <strong className="text-slate-800">t={hoveredBlock.startTime}</strong> · Completed at <strong className="text-slate-800">t={hoveredBlock.endTime}</strong> · Duration: <strong className="text-slate-800">{hoveredBlock.duration} units</strong>
                </span>
              </div>
            )}
          </div>
          {hoveredBlock.jobRef && (
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
              <span>Arrival: {hoveredBlock.jobRef.arrivalTime}</span>
              <span>Wait: {hoveredBlock.jobRef.waitingTime}</span>
              <span>TAT: {hoveredBlock.jobRef.turnaroundTime}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
