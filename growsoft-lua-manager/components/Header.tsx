'use client';

import { useState } from 'react';
import { 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New Lua API documentation available', read: false },
    { id: 2, message: 'Script "auto_farmer" has errors', read: false },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <div className="text-sm text-gray-400">Welcome back,</div>
            <div className="font-semibold">Growsoft Developer</div>
          </div>
          <div className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
            <span className="text-green-400">●</span> Online
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative">
            <BellIcon className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">API Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}