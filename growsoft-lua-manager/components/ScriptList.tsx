'use client';

import ScriptItem from './ScriptItem';
import { 
  DocumentTextIcon,
  ClockIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline';

interface Script {
  id: string;
  name: string;
  content: string;
  status: 'valid' | 'error';
  createdAt: string;
  updatedAt: string;
}

interface ScriptListProps {
  scripts: Script[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ScriptList({ scripts, onDelete, isLoading }: ScriptListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-48"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No scripts yet</h3>
        <p className="text-gray-400 mb-6">Create your first Lua script to get started</p>
      </div>
    );
  }

  const stats = {
    total: scripts.length,
    valid: scripts.filter(s => s.status === 'valid').length,
    error: scripts.filter(s => s.status === 'error').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="w-4 h-4" />
            <span>{stats.total} scripts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{stats.valid} valid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{stats.error} errors</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-4 h-4" />
          <span>Sorted by recent</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scripts.map(script => (
          <ScriptItem
            key={script.id}
            script={script}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}