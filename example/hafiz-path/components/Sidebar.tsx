import React from 'react';
import { LayoutDashboard, TrendingUp, Settings, BookOpen, Sparkles } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'coach', label: 'AI Companion', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-stone-200 flex flex-col justify-between py-6 z-20">
      
      {/* Logo Area */}
      <div className="px-6 mb-8 flex items-center justify-center lg:justify-start gap-3">
        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white shadow-sm">
          <BookOpen size={16} fill="white" />
        </div>
        <span className="hidden lg:block text-lg font-bold text-stone-900 tracking-tight">Hafiz</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-stone-100 text-stone-900 ring-1 ring-stone-200/50' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                }`}
            >
              <Icon 
                size={20} 
                className={`transition-colors duration-200 ${isActive ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'}`} 
                strokeWidth={2}
              />
              <span className={`hidden lg:block text-sm font-medium`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Snippet */}
      <div className="px-4 mt-auto">
        <div className="hidden lg:flex items-center gap-3 p-2 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-600">
            AB
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-900">Abdullah</span>
            <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wide">Student</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;