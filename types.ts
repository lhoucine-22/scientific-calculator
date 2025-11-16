export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type CalculatorMode = 'standard' | 'ai';

export type KeyType = 
  | 'number' 
  | 'operator' 
  | 'action' 
  | 'scientific' 
  | 'memory';

export interface KeyConfig {
  label: string;
  value: string;
  type: KeyType;
  className?: string;
}