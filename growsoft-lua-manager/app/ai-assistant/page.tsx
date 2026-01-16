'use client';

import AIAssistant from '@/components/AIAssistant';
import { 
  LightBulbIcon, 
  CodeBracketIcon,
  BookOpenIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function AIAssistantPage() {
  const examples = [
    {
      title: "Generate Auto Farmer",
      prompt: "Create a Lua script for an auto farmer in Growtopia that plants and breaks blocks automatically",
      icon: CodeBracketIcon,
    },
    {
      title: "Fix Packet Error",
      prompt: "I'm getting an error with packet handling. Can you help fix it?",
      icon: ArrowPathIcon,
    },
    {
      title: "Explain Hook System",
      prompt: "How does the hook system work in Growsoft Lua scripting?",
      icon: BookOpenIcon,
    },
    {
      title: "Optimize Script",
      prompt: "How can I optimize this Lua script for better performance?",
      icon: LightBulbIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-gray-400">Get help with Lua scripting for Growsoft</p>
        </div>
        <div className="text-sm px-3 py-1 bg-purple-900/30 border border-purple-700 rounded-full">
          Powered by OpenAI GPT-4
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => {
              const input = document.querySelector('input[placeholder*="Ask about Lua scripting"]') as HTMLInputElement;
              if (input) {
                input.value = example.prompt;
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
            className="card hover:bg-gray-700/50 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <example.icon className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold mb-1">{example.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{example.prompt}</p>
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <AIAssistant />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-2">🧠 Context-Aware</h3>
          <p className="text-sm text-gray-400">
            AI understands Growsoft API and can reference documentation for accurate scripting help.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-2">⚡ Real-time Feedback</h3>
          <p className="text-sm text-gray-400">
            Get instant feedback on your Lua code with syntax checking and optimization suggestions.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-2">📚 Learn & Improve</h3>
          <p className="text-sm text-gray-400">
            Each interaction helps you understand Lua scripting patterns and best practices.
          </p>
        </div>
      </div>
    </div>
  );
}