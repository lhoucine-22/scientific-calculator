import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HistoryItem, ChatMessage, CalculatorMode } from './types';
import { evaluateExpression } from './utils/mathEngine';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { AIAssistant } from './components/AIAssistant';
import { HistoryPanel } from './components/HistoryPanel';
import { Calculator as CalcIcon, Sparkles, History as HistoryIcon } from 'lucide-react';

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'DEG' | 'RAD'>('DEG');

  // Audio for keypress (optional polish)
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioCtor();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playClickSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    playClickSound();
    
    if (key === 'AC') {
      setExpression('');
      setResult('');
    } else if (key === 'C') {
      setExpression(prev => prev.slice(0, -1));
    } else if (key === '=') {
      try {
        if (!expression) return;
        const evalResult = evaluateExpression(expression, angleUnit);
        setResult(evalResult);
        setHistory(prev => [
          {
            id: Date.now().toString(),
            expression,
            result: evalResult,
            timestamp: Date.now()
          },
          ...prev
        ]);
      } catch (error) {
        setResult('Error');
      }
    } else if (key === 'DEG' || key === 'RAD') {
      setAngleUnit(prev => prev === 'DEG' ? 'RAD' : 'DEG');
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(key)) {
      setExpression(prev => prev + key + '(');
    } else {
      setExpression(prev => prev + key);
    }
  }, [expression, angleUnit, playClickSound]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9+\-*/().]/.test(key)) {
        handleKeyPress(key);
      } else if (key === 'Enter') {
        handleKeyPress('=');
      } else if (key === 'Backspace') {
        handleKeyPress('C');
      } else if (key === 'Escape') {
        handleKeyPress('AC');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const restoreHistoryItem = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile/Tablet Navigation Header */}
      <nav className="md:hidden bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-bold text-lg tracking-tight">NeuralCalc</span>
        </div>
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => setMode('standard')}
            className={`p-2 rounded ${mode === 'standard' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            <CalcIcon size={20} />
          </button>
          <button 
            onClick={() => setMode('ai')}
            className={`p-2 rounded ${mode === 'ai' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
          >
            <Sparkles size={20} />
          </button>
        </div>
      </nav>

      {/* Main Calculator Area */}
      <main className={`flex-1 flex flex-col h-full relative transition-all duration-300 ${mode === 'ai' && window.innerWidth < 768 ? 'hidden' : 'flex'}`}>
        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex absolute top-4 left-4 z-10 items-center space-x-3">
           <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
            N
          </div>
          <h1 className="text-xl font-semibold text-gray-200">NeuralCalc</h1>
        </div>

        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 md:p-8 justify-end">
          <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-end">
            <Display 
              expression={expression} 
              result={result} 
              angleUnit={angleUnit}
            />
            
            <div className="flex justify-between items-center mb-4 px-1">
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="text-gray-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <HistoryIcon size={16} />
                <span>History</span>
              </button>
              
              <div className="flex items-center gap-3">
                 <span className="text-xs text-gray-600 font-mono">
                    {angleUnit === 'DEG' ? 'DEGREES' : 'RADIANS'}
                 </span>
              </div>
            </div>

            <Keypad 
              onPress={handleKeyPress} 
              angleUnit={angleUnit}
            />
          </div>
        </div>
        
        {/* History Side Panel Overlay */}
        {isHistoryOpen && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={() => setIsHistoryOpen(false)}>
            <div 
              className="absolute left-0 top-0 bottom-0 w-80 bg-gray-900 border-r border-gray-800 shadow-2xl transform transition-transform animate-slide-in-left"
              onClick={e => e.stopPropagation()}
            >
              <HistoryPanel 
                history={history} 
                onSelect={restoreHistoryItem} 
                onClose={() => setIsHistoryOpen(false)} 
                onClear={() => setHistory([])}
              />
            </div>
          </div>
        )}
      </main>

      {/* AI Assistant Area - Sidebar on Desktop, Full View on Mobile if Active */}
      <aside className={`
        ${mode === 'ai' ? 'flex' : 'hidden'} 
        md:flex md:w-96 bg-gray-900 border-l border-gray-800 flex-col relative z-10
      `}>
         <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/95 backdrop-blur">
            <div className="flex items-center gap-2 text-brand-400">
              <Sparkles size={18} />
              <h2 className="font-semibold">Gemini Assistant</h2>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMode('standard')}
            >
              Close
            </button>
         </div>
         <div className="flex-1 overflow-hidden">
            <AIAssistant />
         </div>
      </aside>
    </div>
  );
};

export default App;