/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrintJobInput, ScheduledJob, GanttBlock, ScheduleResult, SchedulerMetrics } from '../types/scheduler';

/**
 * ==============================================================================
 * OPERATING SYSTEMS ALGORITHM: FIRST COME FIRST SERVED (FCFS) PRINT SCHEDULER
 * Course: CS25C11 Operating Systems | Contest: Kernel Wars
 *
 * ALGORITHM CHARACTERISTICS:
 * - Nature: Non-preemptive (once the printer begins printing a document, it cannot
 *   be interrupted until the entire print burst is finished).
 * - Policy: FIFO Queue (First In, First Out) ordered strictly by Arrival Time (AT).
 * - Starvation: Free from indefinite starvation under finite burst loads.
 * - Drawback: Susceptible to the Convoy Effect (short jobs stall behind long jobs).
 *
 * STEP-BY-STEP MATHEMATICAL FORMULATION FOR VIVA:
 * 1. Start Time (ST):
 *      ST_i = max(Current Clock Time, Arrival Time_i)
 *      If Current Clock Time < Arrival Time_i, the CPU/Printer sits in an IDLE state.
 *
 * 2. Completion Time (CT):
 *      CT_i = ST_i + Burst Time_i
 *
 * 3. Turnaround Time (TAT):
 *      Total time elapsed from document arrival to complete delivery.
 *      TAT_i = CT_i - Arrival Time_i
 *
 * 4. Waiting Time (WT):
 *      Total time spent by the document waiting in the queue before printing began.
 *      WT_i = TAT_i - Burst Time_i   (equivalently: WT_i = ST_i - Arrival Time_i)
 *
 * 5. Average Turnaround Time (ATT):
 *      ATT = (Sum of all TAT_i) / n
 *
 * 6. Average Waiting Time (AWT):
 *      AWT = (Sum of all WT_i) / n
 * ==============================================================================
 */
export function calculateFCFS(jobs: PrintJobInput[]): ScheduleResult {
  if (jobs.length === 0) {
    const emptyMetrics: SchedulerMetrics = {
      totalJobs: 0,
      totalBurst: 0,
      totalTime: 0,
      totalIdleTime: 0,
      averageTurnaroundTime: 0,
      averageWaitingTime: 0,
      printerUtilization: 0,
      throughput: 0,
    };
    return {
      scheduledJobs: [],
      ganttBlocks: [],
      metrics: emptyMetrics,
    };
  }

  // STEP 1: Stable Sort by Arrival Time
  // In standard FCFS, jobs are serviced in ascending order of arrival time.
  // Ties preserve the original insertion order (FIFO fairness in tie-breaking).
  const indexedJobs = jobs.map((job, originalIndex) => ({ job, originalIndex }));
  indexedJobs.sort((a, b) => {
    if (a.job.arrivalTime !== b.job.arrivalTime) {
      return a.job.arrivalTime - b.job.arrivalTime;
    }
    return a.originalIndex - b.originalIndex;
  });

  const scheduledJobs: ScheduledJob[] = [];
  const ganttBlocks: GanttBlock[] = [];

  let currentTime = 0;
  let totalIdleTime = 0;
  let totalBurstTime = 0;

  // STEP 2: Sequential Non-Preemptive Simulation
  for (const { job } of indexedJobs) {
    // Condition A: Printer is Idle before job arrives
    // If the printer completes previous jobs before the next job arrives,
    // the printer remains idle from currentTime to job.arrivalTime.
    if (currentTime < job.arrivalTime) {
      const idleDuration = job.arrivalTime - currentTime;
      ganttBlocks.push({
        type: 'idle',
        startTime: currentTime,
        endTime: job.arrivalTime,
        duration: idleDuration,
      });
      totalIdleTime += idleDuration;
      // Advance virtual clock to when the job actually arrived
      currentTime = job.arrivalTime;
    }

    // Condition B: Job begins execution
    // Start Time is the current clock time (which is max(currentTime, job.arrivalTime))
    const startTime = currentTime;
    const completionTime = startTime + job.burstTime;
    const turnaroundTime = completionTime - job.arrivalTime;
    const waitingTime = turnaroundTime - job.burstTime;

    const scheduledJob: ScheduledJob = {
      ...job,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    };

    scheduledJobs.push(scheduledJob);

    // Record job block for the Gantt timeline
    ganttBlocks.push({
      type: 'job',
      jobId: job.id,
      documentName: job.documentName,
      startTime,
      endTime: completionTime,
      duration: job.burstTime,
      color: job.color,
      jobRef: scheduledJob,
    });

    totalBurstTime += job.burstTime;
    // Clock advances by the duration of the job's print burst
    currentTime = completionTime;
  }

  // STEP 3: Aggregate Statistics & Metrics Calculation
  const n = scheduledJobs.length;
  const totalTurnaroundTime = scheduledJobs.reduce((acc, j) => acc + j.turnaroundTime, 0);
  const totalWaitingTime = scheduledJobs.reduce((acc, j) => acc + j.waitingTime, 0);
  const totalTime = currentTime; // Makespan (time when last print finishes)

  const averageTurnaroundTime = n > 0 ? Number((totalTurnaroundTime / n).toFixed(2)) : 0;
  const averageWaitingTime = n > 0 ? Number((totalWaitingTime / n).toFixed(2)) : 0;
  
  // Utilization = (Total Busy Time / Total Makespan) * 100
  const printerUtilization = totalTime > 0 ? Number(((totalBurstTime / totalTime) * 100).toFixed(1)) : 0;
  // Throughput = Total Jobs / Total Makespan
  const throughput = totalTime > 0 ? Number((n / totalTime).toFixed(3)) : 0;

  const metrics: SchedulerMetrics = {
    totalJobs: n,
    totalBurst: totalBurstTime,
    totalTime,
    totalIdleTime,
    averageTurnaroundTime,
    averageWaitingTime,
    printerUtilization,
    throughput,
  };

  return {
    scheduledJobs,
    ganttBlocks,
    metrics,
  };
}

/**
 * Standard Sample Data specified by the OS Project Brief:
 * 1. Report.pdf  (Arrival: 0, Burst: 5)
 * 2. Resume.doc  (Arrival: 1, Burst: 3)
 * 3. Photo.png   (Arrival: 2, Burst: 8)
 * 4. Notes.txt   (Arrival: 3, Burst: 6)
 */
export const SAMPLE_JOBS: PrintJobInput[] = [
  {
    id: 'J1',
    documentName: 'Report.pdf',
    arrivalTime: 0,
    burstTime: 5,
    color: '#0284c7', // Sky Blue
    fileType: 'pdf',
  },
  {
    id: 'J2',
    documentName: 'Resume.doc',
    arrivalTime: 1,
    burstTime: 3,
    color: '#0d9488', // Teal
    fileType: 'doc',
  },
  {
    id: 'J3',
    documentName: 'Photo.png',
    arrivalTime: 2,
    burstTime: 8,
    color: '#f59e0b', // Amber (Notice: Long job that triggers Convoy Effect!)
    fileType: 'png',
  },
  {
    id: 'J4',
    documentName: 'Notes.txt',
    arrivalTime: 3,
    burstTime: 6,
    color: '#8b5cf6', // Violet
    fileType: 'txt',
  },
];

/**
 * Preset job colors for custom jobs added by the user
 */
export const JOB_COLORS = [
  '#0284c7', // Sky blue
  '#0d9488', // Teal
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#3b82f6', // Indigo Blue
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
];

export function getFileExtensionType(filename: string): 'pdf' | 'doc' | 'png' | 'txt' | 'other' {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'doc';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'png';
  if (lower.endsWith('.txt')) return 'txt';
  return 'other';
}
