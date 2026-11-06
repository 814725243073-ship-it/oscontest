/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-slate-800">
            Printing Service Scheduler – FCFS
          </span>
          <span aria-hidden="true">·</span>
          <span>CS25C11 Operating Systems</span>
          <span aria-hidden="true">·</span>
          <span className="text-teal-700 font-semibold">Kernel Wars</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Register No: 814725243073
          </span>
        </div>
      </div>
    </footer>
  );
};
