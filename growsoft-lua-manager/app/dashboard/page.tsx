'use client';

import { useState, useEffect } from 'react';
import StatsCards from '@/components/StatsCards';
import Link from 'next/link';
import { 
  ArrowTopRightOnSquareIcon, 
  DocumentPlusIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalScripts: number;
  validScripts: number;
  errorScripts: number;
  recentScripts: Array<{
    id: string;
    name: string;
    status: 'valid' | 'error';
    updatedAt: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScripts: 0,
    validScripts: 0,
    errorScripts: 0,
    recentScripts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/scripts');
      const data = await response.json();
      
      const total = data.scripts?.length || 0;
      const valid = data.scripts?.filter((s: any) => s.status === 'valid').length || 0;
      const error = total - valid;
      
      const recent = data.scripts
        ?.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5) || [];
      
      setStats({
        totalScripts: total,
        validScripts: valid,
        errorScripts: error,
        recentScripts: recent,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome to Growsoft Lua Script Manager</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/editor/new" className="btn-primary flex items-center space-x-2">
            <DocumentPlusIcon className="w-5 h-5" />
            <span>New Script</span>
          </Link>
          <Link href="/ai-assistant" className="btn-secondary flex items-center space-x-2">
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>

      <StatsCards
        totalScripts={stats.totalScripts}
        validScripts={stats.validScripts}
        errorScripts={stats.errorScripts}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Scripts</h2>
            <Link href="/scripts" className="text-sm text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentScripts.map((script) => (
              <div
                key={script.id}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700"
              >
                <div>
                  <div className="font-medium">{script.name}</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {new Date(script.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    script.status === 'valid'
                      ? 'bg-green-900/50 text-green-300'
                      : 'bg-red-900/50 text-red-300'
                  }`}
                >
                  {script.status}
                </span>
              </div>
            ))}
            {stats.recentScripts.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                No scripts yet. Create your first script!
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/ai-assistant?action=generate"
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 text-center"
            >
              <div className="text-lg font-medium">Generate</div>
              <div className="text-sm text-gray-400">Script with AI</div>
            </Link>
            <Link
              href="/docs"
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 text-center"
            >
              <div className="text-lg font-medium">Docs</div>
              <div className="text-sm text-gray-400">API Reference</div>
            </Link>
            <Link
              href="/editor/new"
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 text-center"
            >
              <div className="text-lg font-medium">Editor</div>
              <div className="text-sm text-gray-400">Code Editor</div>
            </Link>
            <Link
              href="/scripts"
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 text-center"
            >
              <div className="text-lg font-medium">Manage</div>
              <div className="text-sm text-gray-400">All Scripts</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}