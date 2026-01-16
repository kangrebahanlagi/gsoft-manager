'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Script } from '@/types';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const scriptId = params.id as string;
  const [script, setScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scriptId !== 'new') {
      fetchScript();
    } else {
      setIsLoading(false);
    }
  }, [scriptId]);

  const fetchScript = async () => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`);
      if (!response.ok) {
        throw new Error('Script not found');
      }
      const data = await response.json();
      setScript(data.script);
    } catch (err) {
      setError('Failed to load script');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (content: string) => {
    try {
      const url = scriptId === 'new' 
        ? '/api/scripts' 
        : `/api/scripts/${scriptId}`;
      
      const method = scriptId === 'new' ? 'POST' : 'PUT';
      const name = script?.name || 'Untitled Script';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });

      if (response.ok) {
        const data = await response.json();
        if (scriptId === 'new') {
          router.push(`/editor/${data.script.id}`);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    }
  };

  const handleErrorCheck = async (content: string) => {
    try {
      const response = await fetch('/api/scripts/check-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      return await response.json();
    } catch (err) {
      console.error('Error check failed:', err);
      return { valid: false, error: 'Check failed' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && scriptId !== 'new') {
    return (
      <div className="space-y-6">
        <Link href="/scripts" className="inline-flex items-center text-blue-400 hover:text-blue-300">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Scripts
        </Link>
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Error Loading Script</h3>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="mb-4 flex justify-between items-center">
        <Link href="/scripts" className="inline-flex items-center text-blue-400 hover:text-blue-300">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Scripts
        </Link>
        {script && (
          <div className="text-sm text-gray-400">
            Last modified: {new Date(script.updatedAt || Date.now()).toLocaleDateString()}
          </div>
        )}
      </div>
      
      <CodeEditor
        initialContent={script?.content || `-- New Lua Script\n-- Created on ${new Date().toLocaleDateString()}\n\n-- Example function for Growsoft\nfunction onPacket(packet)\n    if packet.type == "tile_update" then\n        print("Tile updated at:", packet.x, packet.y)\n    end\nend\n\n-- Register packet handler\ngt.onPacket(onPacket)`}
        scriptId={scriptId === 'new' ? undefined : scriptId}
        onSave={handleSave}
        onErrorCheck={handleErrorCheck}
      />
    </div>
  );
}