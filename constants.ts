import { KeyConfig } from './types';

export const KEYS: KeyConfig[] = [
  { label: '2nd', value: '2nd', type: 'scientific' },
  { label: 'deg', value: 'DEG', type: 'scientific' },
  { label: 'sin', value: 'sin', type: 'scientific' },
  { label: 'cos', value: 'cos', type: 'scientific' },
  { label: 'tan', value: 'tan', type: 'scientific' },
  
  { label: 'xʸ', value: '^', type: 'scientific' },
  { label: 'lg', value: 'log', type: 'scientific' },
  { label: 'ln', value: 'ln', type: 'scientific' },
  { label: '(', value: '(', type: 'scientific' },
  { label: ')', value: ')', type: 'scientific' },
  
  { label: '√', value: 'sqrt', type: 'scientific' },
  { label: 'AC', value: 'AC', type: 'action', className: 'text-rose-400 hover:bg-rose-900/20' },
  { label: '⌫', value: 'C', type: 'action', className: 'text-rose-400 hover:bg-rose-900/20' },
  { label: '%', value: '/100', type: 'scientific' },
  { label: '÷', value: '/', type: 'operator' },

  { label: 'x!', value: '!', type: 'scientific' },
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator' },

  { label: '1/x', value: '^(-1)', type: 'scientific' },
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '-', value: '-', type: 'operator' },

  { label: 'π', value: 'PI', type: 'scientific' },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },

  { label: 'e', value: 'E', type: 'scientific' },
  { label: '0', value: '0', type: 'number', className: 'col-span-2' }, // Adjust logic in renderer for span
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'action', className: 'bg-brand-600 hover:bg-brand-500 text-white' },
];