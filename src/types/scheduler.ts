/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PrintJobInput {
  id: string; // e.g. "J1", "J2"
  documentName: string; // e.g. "Report.pdf"
  arrivalTime: number; // Integer >= 0
  burstTime: number; // Integer >= 1 (printing time)
  color: string; // Tailwind-compatible or hex color code
  fileType?: 'pdf' | 'doc' | 'png' | 'txt' | 'other';
}

export interface ScheduledJob extends PrintJobInput {
  startTime: number; // Time when printer starts serving the job
  completionTime: number; // Time when printing is fully finished
  turnaroundTime: number; // Completion Time - Arrival Time
  waitingTime: number; // Turnaround Time - Burst Time (or Start Time - Arrival Time)
}

export interface GanttBlock {
  type: 'job' | 'idle';
  jobId?: string;
  documentName?: string;
  startTime: number;
  endTime: number;
  duration: number;
  color?: string;
  jobRef?: ScheduledJob;
}

export interface SchedulerMetrics {
  totalJobs: number;
  totalBurst: number;
  totalTime: number; // Final completion time / makespan
  totalIdleTime: number;
  averageTurnaroundTime: number;
  averageWaitingTime: number;
  printerUtilization: number; // Percentage
  throughput: number; // Jobs per time unit
}

export interface ScheduleResult {
  scheduledJobs: ScheduledJob[];
  ganttBlocks: GanttBlock[];
  metrics: SchedulerMetrics;
}
