import React from 'react';
import { KEYS } from '../constants';
import { KeyConfig } from '../types';

interface KeypadProps {
  onPress: (value: string) => void;
  angleUnit: 'DEG' | 'RAD';
}

export const Keypad: React.FC<KeypadProps> = ({ onPress, angleUnit }) => {
  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      {KEYS.map((key, index) => {
        const isScientific = key.type === 'scientific';
        const isOperator = key.type === 'operator';
        const isAction = key.type === 'action';
        
        // Handle conditional labels
        let label = key.label;
        if (key.value === 'DEG') label = angleUnit;

        // Base styles
        let baseClasses = "h-14 sm:h-16 rounded-xl flex items-center justify-center text-lg font-medium transition-all active:scale-95 select-none";
        
        // Color logic
        let colorClasses = "bg-gray-800 text-gray-200 hover:bg-gray-700 shadow-md shadow-black/20";
        
        if (isScientific) {
           colorClasses = "bg-gray-850 text-gray-400 hover:bg-gray-800 hover:text-gray-200 text-sm font-semibold";
        } else if (isOperator) {
           colorClasses = "bg-gray-800 text-brand-400 hover:bg-gray-700 text-xl";
        } else if (key.value === '=') {
           colorClasses = "bg-gradient-to-br from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-900/30 hover:brightness-110";
        } else if (key.label === 'AC' || key.label === '⌫') {
           colorClasses = "bg-gray-800 text-rose-400 hover:bg-rose-900/20 hover:text-rose-300";
        }

        if (key.label === '0') {
          baseClasses += " col-span-2 w-full";
        }

        return (
          <button
            key={`${key.value}-${index}`}
            onClick={() => onPress(key.value)}
            className={`${baseClasses} ${colorClasses} ${key.className || ''}`}
            aria-label={key.label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};