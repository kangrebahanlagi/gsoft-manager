'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Scripts', href: '/scripts', icon: DocumentTextIcon },
  { name: 'Editor', href: '/editor/new', icon: CodeBracketIcon },
  { name: 'AI Assistant', href: '/ai-assistant', icon: ChatBubbleLeftRightIcon },
  { name: 'Docs', href: '/docs', icon: BookOpenIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`flex flex-col bg-gray-800/80 backdrop-blur-lg border-r border-gray-700 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Growsoft
                </h1>
                <p className="text-xs text-gray-400">Lua Manager</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-xl font-bold">G</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
              {!collapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-4">
        {!collapsed && (
          <div className="px-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              System Status
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">All systems operational</span>
            </div>
          </div>
        )}

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Developer</p>
                <p className="text-xs text-gray-400">admin@growsoft</p>
              </div>
            </div>
          )}
          {collapsed && (
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          )}
          <button className="p-1.5 rounded-lg hover:bg-gray-700">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}