'use client';

import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
  totalScripts: number;
  validScripts: number;
  errorScripts: number;
  isLoading: boolean;
}

export default function StatsCards({ 
  totalScripts, 
  validScripts, 
  errorScripts, 
  isLoading 
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Scripts',
      value: totalScripts,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      change: '+12%',
    },
    {
      title: 'Valid Scripts',
      value: validScripts,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-400',
      change: '+8%',
    },
    {
      title: 'Scripts with Errors',
      value: errorScripts,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-400',
      change: errorScripts > 0 ? 'Needs attention' : 'All good',
    },
    {
      title: 'Success Rate',
      value: totalScripts > 0 ? `${Math.round((validScripts / totalScripts) * 100)}%` : '0%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      change: 'from last month',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${stat.color} rounded-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className={`text-sm ${stat.textColor}`}>
              {stat.change}
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.title}</div>
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color.replace('bg-', 'bg-')}`}
                style={{ 
                  width: index === 3 && totalScripts > 0 
                    ? `${Math.round((validScripts / totalScripts) * 100)}%` 
                    : index === 0 ? '100%' 
                    : index === 1 && totalScripts > 0 
                    ? `${Math.round((validScripts / totalScripts) * 100)}%`
                    : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}