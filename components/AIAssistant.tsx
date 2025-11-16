import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Hello! I'm your AI math companion. I can help you solve complex problems, explain theories, or breakdown calculations. Try asking: 'What is the derivative of sin(x)?'"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for context (limit to last 10 messages to save tokens/complexity)
      const historyContext = messages.slice(-10).map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await sendMessageToGemini(input, historyContext);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the neural network. Please check your internet connection or API key.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      // Stop logic handled by browser usually, but we can force stop if we had the instance ref
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[85%] rounded-2xl p-4 relative group
              ${msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-sm' 
                : 'bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700'}
              ${msg.isError ? 'bg-red-900/20 border-red-500/50 text-red-200' : ''}
            `}>
              {/* Icon Badge */}
              <div className={`
                absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm
                ${msg.role === 'user' 
                  ? 'hidden' 
                  : 'bg-gray-700 text-brand-400 ring-2 ring-gray-900'}
              `}>
                <Bot size={14} />
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4 border border-gray-700 flex items-center space-x-2">
                <Loader2 className="animate-spin text-brand-400" size={16} />
                <span className="text-xs text-gray-400 animate-pulse">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="relative flex items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
          <button 
             onClick={toggleMic}
             className={`p-3 hover:text-brand-400 transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}
             title="Voice Input"
          >
            <Mic size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a math question..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-500 resize-none py-3 max-h-32"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 text-brand-500 hover:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-600">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};