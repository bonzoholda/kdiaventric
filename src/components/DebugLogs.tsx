import React from 'react';

interface DebugLogsProps {
  logs: string[];
}

export const DebugLogs: React.FC<DebugLogsProps> = ({ logs }) => {
  return (
    <div className="bg-black text-emerald-400 p-4 rounded-md font-mono text-sm overflow-auto max-h-96 border border-emerald-500 mt-6 shadow-lg">
      <h3 className="font-bold text-slate-100 mb-3 border-b border-emerald-800 pb-2">Debug Logs (Affiliate Hub):</h3>
      {logs.length === 0 ? (
        <div className="text-gray-500 italic">No logs available yet.</div>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="mb-1">{log}</div>
        ))
      )}
    </div>
  );
};
