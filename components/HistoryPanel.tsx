import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Clock } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClose, onClear }) => {
  return (
    <div className="flex flex-col h-full text-gray-200">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-brand-400" />
          <h2 className="font-semibold">History</h2>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onClear} 
            className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-rose-400 transition-colors"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-2">
            <Clock size={32} className="opacity-20" />
            <span className="text-sm">No history yet</span>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer border border-transparent hover:border-gray-700 transition-all"
            >
              <div className="text-sm text-gray-400 font-mono mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {item.expression}
              </div>
              <div className="text-lg text-brand-400 font-mono font-medium text-right">
                = {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};