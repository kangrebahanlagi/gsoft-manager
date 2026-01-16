'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';

interface Script {
  id: string;
  name: string;
  content: string;
  status: 'valid' | 'error';
  createdAt: string;
  updatedAt: string;
}

interface ScriptItemProps {
  script: Script;
  onDelete: (id: string) => void;
}

export default function ScriptItem({ script, onDelete }: ScriptItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name}.lua`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDuplicate = async () => {
    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${script.name} (Copy)`,
          content: script.content 
        }),
      });
      
      if (response.ok) {
        alert('Script duplicated successfully!');
      }
    } catch (error) {
      console.error('Failed to duplicate script:', error);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {script.status === 'valid' ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
            )}
            <Link href={`/editor/${script.id}`} className="font-semibold hover:text-blue-400">
              {script.name}
            </Link>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <CalendarDaysIcon className="w-3 h-3 mr-1" />
            {new Date(script.updatedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                <Link
                  href={`/editor/${script.id}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                  onClick={() => setShowMenu(false)}
                >
                  <PencilIcon className="w-4 h-4 mr-3" />
                  Edit
                </Link>
                <button
                  onClick={() => {
                    handleDuplicate();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    handleDownload();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-3" />
                  Download
                </button>
                <button
                  onClick={() => {
                    onDelete(script.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-red-900/30 text-red-400 rounded-b-lg"
                >
                  <TrashIcon className="w-4 h-4 mr-3" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">Preview</div>
        <pre className="text-xs bg-gray-900/50 p-2 rounded-lg overflow-x-auto">
          {script.content.substring(0, 100)}
          {script.content.length > 100 && '...'}
        </pre>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            script.status === 'valid'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}
        >
          {script.status}
        </span>
        <div className="text-gray-500">
          {Math.ceil(script.content.length / 1024)} KB
        </div>
      </div>
    </div>
  );
}