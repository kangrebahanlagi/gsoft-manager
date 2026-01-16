'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  SparklesIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  CpuChipIcon,
  StopIcon 
} from '@heroicons/react/24/outline';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant specialized in Lua scripting for Growtopia Private Server (Growsoft). I can help you generate, fix, explain, and optimize your Lua scripts. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingContent]);

  const simulateTyping = (text: string, onComplete: () => void) => {
    setIsTyping(true);
    setTypingContent('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingContent(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete();
      }
    }, 20);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: 'growtopia-lua-growsoft',
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
	  if (!data.success) {
	  setMessages(prev => [
		...prev,
		{
		  role: 'assistant',
		  content: `⚠️ ${data.reply}`,
		  timestamp: new Date(),
		},
	  ]);
	  setIsLoading(false);
	  return;
	}

      
      simulateTyping(data.reply, () => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      });

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('AI request failed:', error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'AI sedang tidak tersedia. Pastikan DeepSeek API key & saldo tersedia.',
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsTyping(false);
      if (typingContent) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: typingContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setTypingContent('');
      }
    }
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      generate: 'Generate a Lua script for auto farming in Growtopia that plants seeds and harvests crops automatically.',
      fix: 'Fix this Lua script error: "attempt to call nil value (field \'sendPacket\')"',
      explain: 'Explain how the packet handling system works in Growsoft Lua scripting.',
      optimize: 'Optimize this Lua script for better performance and memory usage.',
    };
    setInput(prompts[action as keyof typeof prompts] || '');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <p className="text-sm text-gray-400">Growsoft Lua Scripting Expert</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <CpuChipIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Online</span>
            </div>
            {isLoading && (
              <button
                onClick={handleStopGeneration}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 text-sm"
              >
                <StopIcon className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-700/50 text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <UserCircleIcon className="w-6 h-6" />
                  ) : (
                    <SparklesIcon className="w-6 h-6 text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-75 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && typingContent && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-2xl p-4 bg-gray-700/50">
              <div className="flex items-start space-x-3">
                <SparklesIcon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="whitespace-pre-wrap">
                    {typingContent}
                    <span className="animate-pulse">▊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['generate', 'fix', 'explain', 'optimize'].map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-center capitalize transition-all hover:scale-105"
            >
              {action} Script
            </button>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Lua scripting, Growsoft API, or request script generation..."
            className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isLoading}
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 self-end"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          AI can make mistakes. Always test scripts in a safe environment.
        </div>
      </div>
    </div>
  );
}