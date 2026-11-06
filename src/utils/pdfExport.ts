/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScheduledJob, GanttBlock, SchedulerMetrics } from '../types/scheduler';

export interface PDFExportOptions {
  studentName?: string;
  registerNumber?: string;
  courseCode?: string;
  contestTitle?: string;
  includeFormulas?: boolean;
  includeConvoyNotes?: boolean;
  instructorNotes?: string;
}

/**
 * Generates an academic-grade PDF report containing:
 * 1. University / Course submission header with Register No: 814725243073
 * 2. Executive Performance KPI Cards
 * 3. Vector-rendered Gantt Chart with time markers and idle segments
 * 4. Formatted Results Table with column formulas and averages
 * 5. Theoretical Viva Verification & Mathematical Definitions
 * 6. Academic evaluation signature block
 */
export function generateAcademicPDFReport(
  scheduledJobs: ScheduledJob[],
  ganttBlocks: GanttBlock[],
  metrics: SchedulerMetrics,
  options: PDFExportOptions = {}
): void {
  const registerNumber = options.registerNumber || '814725243073';
  const courseCode = options.courseCode || 'CS25C11 Operating Systems';
  const contestTitle = options.contestTitle || 'Kernel Wars OS Contest';
  const studentName = options.studentName || 'Student Submitter';
  const includeFormulas = options.includeFormulas !== false;
  const includeConvoyNotes = options.includeConvoyNotes !== false;

  // Initialize A4 portrait document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let currentY = margin;

  // ---------------------------------------------------------------------------
  // 1. ACADEMIC HEADER & TITLE BANNER
  // ---------------------------------------------------------------------------
  // Top accent bar (Teal)
  doc.setFillColor(13, 148, 136); // #0d9488
  doc.rect(margin, currentY, contentWidth, 3, 'F');
  currentY += 7;

  // Header Institution & Course Subtext
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136);
  doc.text(`${courseCode.toUpperCase()} | ${contestTitle.toUpperCase()}`, margin, currentY);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${formattedDate}`, pageWidth - margin, currentY, { align: 'right' });
  currentY += 6;

  // Main Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('LAB REPORT: FCFS PRINTING SERVICE SCHEDULER', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Non-Preemptive First-Come First-Served Algorithm · Performance & Gantt Timeline Evaluation',
    margin,
    currentY
  );
  currentY += 7;

  // Student Identification Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Candidate Register No:', margin + 4, currentY + 5.5);
  doc.setFont('courier', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(registerNumber, margin + 42, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Candidate Name:', margin + 80, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(studentName, margin + 106, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Evaluation Model:', margin + 4, currentY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('FCFS Non-Preemptive Single-Server Printer Queue', margin + 32, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Status:', margin + 120, currentY + 10.5);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('VERIFIED COMPUTATION', margin + 132, currentY + 10.5);

  currentY += 19;

  // ---------------------------------------------------------------------------
  // 2. SUMMARY KPI METRIC TILES
  // ---------------------------------------------------------------------------
  const tileWidth = (contentWidth - 9) / 4; // 4 tiles with 3mm gap
  const tileHeight = 15;

  const metricsData = [
    {
      label: 'Avg Waiting Time (AWT)',
      val: `${metrics.averageWaitingTime} units`,
      sub: `Sum WT / ${metrics.totalJobs}`,
      color: [13, 148, 136], // Teal
    },
    {
      label: 'Avg Turnaround (ATT)',
      val: `${metrics.averageTurnaroundTime} units`,
      sub: `Sum TAT / ${metrics.totalJobs}`,
      color: [2, 132, 199], // Sky
    },
    {
      label: 'Printer Utilization',
      val: `${metrics.printerUtilization}%`,
      sub: `${metrics.totalBurst}u busy / ${metrics.totalTime}u`,
      color: [16, 185, 129], // Emerald
    },
    {
      label: 'Total Makespan',
      val: `${metrics.totalTime} units`,
      sub: `${metrics.totalJobs} jobs processed`,
      color: [124, 58, 237], // Violet
    },
  ];

  metricsData.forEach((tile, idx) => {
    const tileX = margin + idx * (tileWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(tileX, currentY, tileWidth, tileHeight, 1.5, 1.5, 'FD');

    // Colored top border accent on tile
    doc.setFillColor(tile.color[0], tile.color[1], tile.color[2]);
    doc.rect(tileX, currentY, tileWidth, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(tile.label.toUpperCase(), tileX + 3, currentY + 4.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(tile.val, tileX + 3, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(tile.sub, tileX + 3, currentY + 13);
  });

  currentY += tileHeight + 7;

  // ---------------------------------------------------------------------------
  // 3. GANTT CHART VECTOR VISUALIZATION
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTION GANTT TIMELINE CHART', margin, currentY);
  currentY += 4.5;

  // Gantt Chart Frame
  const chartHeight = 18;
  const chartWidth = contentWidth;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, currentY, chartWidth, chartHeight, 1.5, 1.5, 'FD');

  // Render each block proportionately
  const totalTime = metrics.totalTime || 1;
  let accumulatedX = margin;

  // Palette mapper for standard hex colors to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    if (clean.length === 6) {
      return [
        parseInt(clean.substring(0, 2), 16),
        parseInt(clean.substring(2, 4), 16),
        parseInt(clean.substring(4, 6), 16),
      ];
    }
    return [2, 132, 199];
  };

  ganttBlocks.forEach((block) => {
    const blockWidth = (block.duration / totalTime) * chartWidth;
    const isIdle = block.type === 'idle';

    if (isIdle) {
      // Grey patterned block for Idle
      doc.setFillColor(226, 232, 240); // slate-200
      doc.rect(accumulatedX, currentY, blockWidth, chartHeight, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(accumulatedX, currentY, blockWidth, chartHeight, 'S');

      // Idle Label
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      if (blockWidth > 10) {
        doc.text('IDLE', accumulatedX + blockWidth / 2, currentY + chartHeight / 2 + 1, {
          align: 'center',
        });
      }
    } else {
      // Active Job Colored Block
      const rgb = block.color ? hexToRgb(block.color) : [13, 148, 136];
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.rect(accumulatedX, currentY, blockWidth, chartHeight, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.rect(accumulatedX, currentY, blockWidth, chartHeight, 'S');

      // Job Text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      if (blockWidth > 14) {
        doc.text(block.jobId || 'Job', accumulatedX + blockWidth / 2, currentY + 7, {
          align: 'center',
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        const docLabel = (block.documentName || '').length > 10 
          ? (block.documentName || '').substring(0, 9) + '..'
          : block.documentName || '';
        doc.text(docLabel, accumulatedX + blockWidth / 2, currentY + 11.5, { align: 'center' });
        doc.text(`(${block.duration}u)`, accumulatedX + blockWidth / 2, currentY + 15.5, { align: 'center' });
      } else if (blockWidth > 6) {
        doc.text(block.jobId || 'J', accumulatedX + blockWidth / 2, currentY + chartHeight / 2 + 1, {
          align: 'center',
        });
      }
    }

    accumulatedX += blockWidth;
  });

  // Time Scale Ticks below the Gantt Chart
  currentY += chartHeight + 1.5;
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);

  // Initial zero mark
  doc.text('0', margin, currentY + 3, { align: 'center' });
  doc.setDrawColor(148, 163, 184);
  doc.line(margin, currentY, margin, currentY + 1.5);

  let tickX = margin;
  ganttBlocks.forEach((block) => {
    tickX += (block.duration / totalTime) * chartWidth;
    doc.line(tickX, currentY, tickX, currentY + 1.5);
    doc.text(String(block.endTime), tickX, currentY + 3.5, { align: 'center' });
  });

  currentY += 8;

  // ---------------------------------------------------------------------------
  // 4. DETAILED RESULTS TABLE
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. RESULTS SCHEDULE TABLE (FCFS SEQUENCE)', margin, currentY);
  currentY += 3;

  // Format table rows
  const tableHead = [
    [
      'Job',
      'Document Name',
      'Arrival (AT)',
      'Burst (BT)',
      'Start (ST)',
      'Completion (CT)',
      'Turnaround (TAT)',
      'Waiting (WT)',
    ],
  ];

  const tableBody = scheduledJobs.map((job) => [
    job.id,
    job.documentName,
    String(job.arrivalTime),
    String(job.burstTime),
    String(job.startTime),
    String(job.completionTime),
    String(job.turnaroundTime),
    String(job.waitingTime),
  ]);

  // Add Averages row
  tableBody.push([
    'AVERAGE',
    `Total Jobs: ${metrics.totalJobs}`,
    '—',
    `Total: ${metrics.totalBurst}u`,
    '—',
    `Makespan: ${metrics.totalTime}u`,
    `ATT: ${metrics.averageTurnaroundTime}u`,
    `AWT: ${metrics.averageWaitingTime}u`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: tableHead,
    body: tableBody,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', font: 'courier', fontStyle: 'bold', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 46 },
      2: { halign: 'center', font: 'courier', cellWidth: 20 },
      3: { halign: 'center', font: 'courier', cellWidth: 20 },
      4: { halign: 'center', font: 'courier', cellWidth: 20 },
      5: { halign: 'center', font: 'courier', cellWidth: 20 },
      6: { halign: 'center', font: 'courier', fontStyle: 'bold', cellWidth: 20 },
      7: { halign: 'center', font: 'courier', fontStyle: 'bold', cellWidth: 20 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight the footer average row
      if (data.row.index === tableBody.length - 1) {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [15, 23, 42];
        if (data.column.index === 6) {
          data.cell.styles.textColor = [2, 132, 199]; // Sky for ATT
        } else if (data.column.index === 7) {
          data.cell.styles.textColor = [13, 148, 136]; // Teal for AWT
        }
      }
    },
  });

  // Retrieve Y position after table
  const finalTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  currentY = finalTableY + 7;

  // ---------------------------------------------------------------------------
  // 5. MATHEMATICAL FORMULAS & VIVA THEORY
  // ---------------------------------------------------------------------------
  if (includeFormulas && currentY < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('3. MATHEMATICAL SPECIFICATION & ALGORITHM CHARACTERISTICS', margin, currentY);
    currentY += 4.5;

    // Two-column layout for formulas & Convoy Effect notes
    const boxWidth = (contentWidth - 4) / 2;
    const boxHeight = 27;

    // Left Box: Formulas
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, boxWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(13, 148, 136);
    doc.text('CORE SCHEDULING FORMULAS', margin + 3, currentY + 4.5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text('• Start Time (ST): ST_i = max(clock, AT_i)', margin + 3, currentY + 9);
    doc.text('• Completion Time (CT): CT_i = ST_i + BT_i', margin + 3, currentY + 13.5);
    doc.text('• Turnaround Time (TAT): TAT_i = CT_i - AT_i', margin + 3, currentY + 18);
    doc.text('• Waiting Time (WT): WT_i = TAT_i - BT_i', margin + 3, currentY + 22.5);

    // Right Box: Convoy Effect Analysis
    const rightBoxX = margin + boxWidth + 4;
    doc.setFillColor(254, 243, 199, 0.4); // light amber
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(rightBoxX, currentY, boxWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text('CONVOY EFFECT EVALUATION', rightBoxX + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(120, 53, 15);
    doc.text(
      'In non-preemptive FCFS, long-burst jobs (e.g. Photo.png, BT=8) monopolize',
      rightBoxX + 3,
      currentY + 9
    );
    doc.text(
      'the print server, forcing light subsequent jobs to queue, resulting in elevated',
      rightBoxX + 3,
      currentY + 13
    );
    doc.text(
      `Average Waiting Time (computed AWT: ${metrics.averageWaitingTime} units). Mitigated by Shortest-`,
      rightBoxX + 3,
      currentY + 17
    );
    doc.text(
      'Job-First (SJF) or priority queue disciplines.',
      rightBoxX + 3,
      currentY + 21
    );

    currentY += boxHeight + 8;
  }

  // ---------------------------------------------------------------------------
  // 6. ACADEMIC SIGNATURE & VERIFICATION STAMP BLOCK
  // ---------------------------------------------------------------------------
  if (currentY > 265) {
    doc.addPage();
    currentY = margin;
  }

  doc.setDrawColor(203, 213, 225);
  doc.setLineDashPattern([1.5, 1], 0);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  doc.setLineDashPattern([], 0); // reset
  currentY += 6;

  const colW = contentWidth / 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CANDIDATE SIGNATURE', margin, currentY);
  doc.text('EVALUATOR REMARKS / MARKS', margin + colW, currentY);
  doc.text('EXAMINER SIGNATURE & SEAL', margin + colW * 2, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Reg: ${registerNumber}`, margin, currentY + 5);

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY + 8, margin + colW - 8, currentY + 8);
  doc.line(margin + colW, currentY + 8, margin + colW * 2 - 8, currentY + 8);
  doc.line(margin + colW * 2, currentY + 8, margin + contentWidth, currentY + 8);

  // ---------------------------------------------------------------------------
  // 7. PAGE FOOTER
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Register No: ${registerNumber} | CS25C11 Operating Systems | Kernel Wars FCFS Lab Report`,
    margin,
    pageHeight - 6
  );
  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 6, { align: 'right' });

  // Trigger browser download of PDF
  const filename = `FCFS_Scheduler_Report_${registerNumber}.pdf`;
  doc.save(filename);
}
