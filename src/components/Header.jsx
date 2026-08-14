import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-16 flex items-center justify-between px-4 md:px-8">
      <div className="flex-1"></div> {/* Spacer to push things to right */}
      
      <div className="flex items-center gap-6">
        {/* User Info (Optional if already in dashboard, but good for professional look) */}
        <div className="hidden md:flex items-center gap-3 border-r border-slate-200 dark:border-white/10 pr-6">
           <div className="flex flex-col text-right">
             <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</span>
             <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</span>
           </div>
           <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-500/30">
             {user?.name?.charAt(0) || 'U'}
           </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 p-1 rounded-xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setTheme('light')} 
            className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('system')} 
            className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title="System Theme"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')} 
            className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 text-violet-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
