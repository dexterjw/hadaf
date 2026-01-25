import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import AICoach from './components/AICoach';
import { UserSettings, Tab } from './types';

const DEFAULT_SETTINGS: UserSettings = {
  name: "Abdullah",
  totalPages: 604,
  startPage: 1,
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1st of current year
  currentPage: 45,
  dailyGoalPages: 2,
  revisionGoalPages: 20
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Derived state calculations
  const stats = useMemo(() => {
    const total = settings.totalPages;
    const current = settings.currentPage;
    const remaining = total - current;
    const rate = settings.dailyGoalPages || 1; // Avoid division by zero
    
    const daysLeft = Math.ceil(remaining / rate);
    const today = new Date();
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + daysLeft);
    
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    const juz = Math.floor(current / 20); // Roughly 20 pages per Juz

    return {
      daysRemaining: daysLeft,
      estimatedCompletionDate: completionDate,
      progressPercentage: percentage,
      juzCompleted: juz,
      pagesRemaining: remaining
    };
  }, [settings]);

  return (
    <div className="flex h-screen w-full bg-[#FAFAF9] bg-dots text-stone-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          
          {/* Header */}
          <header className="mb-6 flex items-center justify-between pt-2">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                {activeTab === 'dashboard' && `Salam, ${settings.name}`}
                {activeTab === 'analytics' && 'Journey Analytics'}
                {activeTab === 'settings' && 'Configuration'}
                {activeTab === 'coach' && 'AI Hifz Companion'}
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                {activeTab === 'dashboard' && 'Let’s continue your blessed journey.'}
                {activeTab === 'analytics' && 'Visualize your progress and future milestones.'}
                {activeTab === 'settings' && 'Adjust your plan and personal details.'}
                {activeTab === 'coach' && 'Ask for motivation, tafsir, or memorization tips.'}
              </p>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>On Track</span>
            </div>
          </header>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            {activeTab === 'dashboard' && (
              <Dashboard settings={settings} stats={stats} />
            )}
            {activeTab === 'analytics' && (
              <Analytics settings={settings} stats={stats} />
            )}
            {activeTab === 'settings' && (
              <Settings settings={settings} onSave={setSettings} />
            )}
            {activeTab === 'coach' && (
              <AICoach userName={settings.name} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}