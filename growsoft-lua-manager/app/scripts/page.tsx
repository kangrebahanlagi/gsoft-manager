'use client';

import { useState, useEffect, useRef } from 'react';
import ScriptList from '@/components/ScriptList';
import { 
  PlusIcon, 
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

interface Script {
  id: string;
  name: string;
  content: string;
  status: 'valid' | 'error';
  createdAt: string;
  updatedAt: string;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'error'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  useEffect(() => {
    let filtered = scripts;
    
    if (searchTerm) {
      filtered = filtered.filter(script =>
        script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(script => script.status === statusFilter);
    }
    
    setFilteredScripts(filtered);
  }, [scripts, searchTerm, statusFilter]);

  const fetchScripts = async () => {
    try {
      const response = await fetch('/api/scripts');
      const data = await response.json();
      setScripts(data.scripts || []);
      setFilteredScripts(data.scripts || []);
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScript = async () => {
    const name = prompt('Enter script name:');
    if (!name) return;

    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          content: `-- ${name}\n-- Created on ${new Date().toLocaleDateString()}\n\nfunction main()\n    -- Your Lua code here\n    print("Hello from Growsoft!")\nend\n\nmain()` 
        }),
      });
      
      if (response.ok) {
        await fetchScripts();
      }
    } catch (error) {
      console.error('Failed to create script:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const name = file.name.replace('.lua', '');
      
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });
      
      if (response.ok) {
        await fetchScripts();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error('Failed to upload script:', error);
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      const response = await fetch(`/api/scripts/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setScripts(scripts.filter(script => script.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete script:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scripts</h1>
          <p className="text-gray-400">Manage your Lua scripts for Growsoft</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateScript}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Script</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".lua"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg ${statusFilter === 'all' ? 'bg-blue-600' : 'bg-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('valid')}
            className={`px-4 py-2 rounded-lg ${statusFilter === 'valid' ? 'bg-green-600' : 'bg-gray-800'}`}
          >
            Valid
          </button>
          <button
            onClick={() => setStatusFilter('error')}
            className={`px-4 py-2 rounded-lg ${statusFilter === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}
          >
            Error
          </button>
        </div>
      </div>

      <ScriptList
        scripts={filteredScripts}
        onDelete={handleDeleteScript}
        isLoading={isLoading}
      />

      {filteredScripts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No scripts found</h3>
          <p className="text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try changing your search or filter criteria'
              : 'Get started by creating your first Lua script'}
          </p>
        </div>
      )}
    </div>
  );
}