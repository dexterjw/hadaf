import React from 'react';
import { UserSettings, CompletionData } from '../types';
import { CheckCircle2, Circle, Calendar, BookOpen, ArrowRight, Flame, MoreHorizontal, TrendingUp, Flag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  settings: UserSettings;
  stats: CompletionData;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, stats }) => {
  const today = new Date();
  const options = { weekday: 'long' as const, year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
  const dateString = today.toLocaleDateString('en-US', options);

  // Data for circular progress
  const dailyData = [
    { name: 'Completed', value: 0 }, 
    { name: 'Remaining', value: settings.dailyGoalPages },
  ];
  
  // Use slightly muted/technical colors
  const dailyCOLORS = ['#ea580c', '#e7e5e4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-2">
      
      {/* Left Column: Today's Focus & Weekly Goals */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Hero Card - Today's Goal */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 relative overflow-hidden group">
          {/* Technical Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider border border-orange-100 shadow-sm">
                  Daily Target
                </span>
                <span className="text-xs text-stone-500 font-semibold flex items-center gap-1.5">
                  <Calendar size={12} className="text-stone-400" />
                  {dateString}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-stone-900 tracking-tight leading-tight">
                  Pages {settings.currentPage + 1} - {settings.currentPage + settings.dailyGoalPages}
                </h2>
                <p className="text-stone-500 font-medium mt-1 flex items-center gap-2">
                  <span className="text-stone-300">•</span>
                  Juz {Math.floor((settings.currentPage + 1) / 20) + 1}
                  <span className="text-stone-300">•</span>
                  Surah Al-Baqarah
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-2xl border border-stone-200 shadow-sm">
               <div className="h-14 w-14 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dailyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={28}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {dailyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={dailyCOLORS[index % dailyCOLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex flex-col">
                 <span className="text-lg font-bold text-stone-900 leading-none">0 <span className="text-stone-400 font-normal">/ {settings.dailyGoalPages}</span></span>
                 <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Pages Done</span>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100 flex gap-3">
             <button className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-stone-800 transition-all flex items-center gap-2 border border-stone-900 active:scale-95">
               <CheckCircle2 size={16} />
               <span>Mark Complete</span>
             </button>
             <button className="bg-white text-stone-600 border border-stone-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-50 transition-all active:scale-95">
               View Tafsir
             </button>
          </div>
        </div>

        {/* Weekly Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
           {/* Revision Card */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between h-56 group hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Goal</span>
                      <span className="text-sm font-bold text-stone-700">Revision</span>
                    </div>
                </div>
                <button className="text-stone-300 hover:text-stone-500">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                   <h3 className="text-4xl font-bold text-stone-900 tracking-tight">{settings.revisionGoalPages}</h3>
                   <span className="text-sm font-bold text-stone-500">pages</span>
                </div>
                <p className="text-stone-500 text-xs font-medium">Scheduled for review today</p>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] font-medium text-stone-400">
                   <span>30% Complete</span>
                   <span>Target: {settings.revisionGoalPages}</span>
                </div>
              </div>
           </div>

           {/* Streak Card */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between h-56 relative overflow-hidden group hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                        <Flame size={20} fill="currentColor" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Status</span>
                      <span className="text-sm font-bold text-stone-700">Streak</span>
                    </div>
                </div>
              </div>
              
              <div className="z-10 space-y-1">
                <div className="flex items-baseline gap-1">
                    <h3 className="text-4xl font-bold text-stone-900 tracking-tight">12</h3>
                    <span className="text-sm font-bold text-stone-500">days</span>
                </div>
                <p className="text-stone-500 text-xs font-medium">You're on a roll!</p>
              </div>

              <div className="flex gap-2 z-10 pt-2 items-end h-16">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const active = i < 3;
                  const height = active ? 'h-full' : 'h-8';
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-2 items-center h-full group/bar">
                        <div className={`w-full rounded-md transition-all duration-300 ${active ? 'bg-orange-500 h-8 shadow-sm shadow-orange-200' : 'bg-stone-100 h-2 group-hover/bar:bg-stone-200'}`}></div>
                        <span className={`text-[9px] font-bold uppercase ${active ? 'text-stone-800' : 'text-stone-300'}`}>{day}</span>
                    </div>
                  )
                })}
              </div>
           </div>
        </div>
      </div>

      {/* Right Column: Monthly Progress (Revised) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col h-full lg:min-h-[600px] overflow-hidden">
        
        {/* Widget Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-stone-500"/>
                Monthly Progress
            </h3>
            <button className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-md hover:bg-stone-100">
                <MoreHorizontal size={16} />
            </button>
        </div>
        
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Chart Section */}
            <div className="p-8 flex flex-col items-center justify-center border-b border-stone-100 border-dashed relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-stone-300 uppercase tracking-widest border border-stone-100 px-2 py-0.5 rounded-full">
                    Juz {stats.juzCompleted + 1}
                </div>
                
                <div className="relative w-48 h-48 my-2">
                    {/* Background Track */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="#f5f5f4"
                        strokeWidth="16"
                        fill="transparent"
                        />
                        {/* Progress */}
                        <circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="#ea580c"
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 84}
                        strokeDashoffset={2 * Math.PI * 84 * (1 - (stats.progressPercentage / 100))}
                        strokeLinecap="round"
                        className="drop-shadow-sm"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-stone-900 tracking-tight">{stats.progressPercentage.toFixed(0)}%</span>
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1">Completed</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 w-full gap-4 mt-8">
                    <div className="flex flex-col items-center p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Current Juz</span>
                        <span className="text-xl font-bold text-stone-900 mt-1">{stats.juzCompleted + 1}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Pages Left</span>
                        <span className="text-xl font-bold text-stone-900 mt-1">{stats.pagesRemaining}</span>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="p-6">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Flag size={12} />
                    Journey Timeline
                </h4>
                
                <div className="relative space-y-0 pl-2">
                    {/* Continuous Line */}
                    <div className="absolute left-[15px] top-2 bottom-6 w-px bg-stone-200"></div>

                    {/* Past Milestone */}
                    <div className="relative flex gap-4 pb-8 group">
                        <div className="w-8 h-8 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center z-10 text-stone-400 group-hover:border-stone-300 group-hover:bg-white transition-all shrink-0">
                            <CheckCircle2 size={14} />
                        </div>
                        <div className="pt-1">
                            <span className="text-xs font-bold text-stone-900 block group-hover:text-stone-700 transition-colors">Juz {stats.juzCompleted} Completed</span>
                            <span className="text-[10px] text-stone-400 font-medium">Oct 24, 2023</span>
                        </div>
                    </div>

                    {/* Current Milestone (Active) */}
                    <div className="relative flex gap-4 pb-8">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center z-10 shadow-sm shadow-orange-100 ring-4 ring-orange-50 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                        </div>
                        <div className="pt-1">
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1 block">Current Focus</span>
                            <span className="text-sm font-bold text-stone-900 block leading-tight">Reach Page {settings.currentPage + 50}</span>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-stone-100 rounded-md text-[10px] font-bold text-stone-600 border border-stone-200/50">
                                <Calendar size={10} className="text-stone-400" />
                                <span>Approx. 25 days left</span>
                            </div>
                        </div>
                    </div>

                    {/* Future Milestone */}
                    <div className="relative flex gap-4 pb-4">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center z-10 text-stone-300 shrink-0">
                            <Circle size={14} />
                        </div>
                        <div className="pt-1 opacity-60">
                            <span className="text-sm font-bold text-stone-900 block">Finish Juz {stats.juzCompleted + 1}</span>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Upcoming</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 mt-auto z-10">
            <button className="w-full py-3 rounded-xl bg-white border border-stone-200 shadow-sm text-stone-600 font-bold text-xs hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
                View Detailed Analytics
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-stone-400 group-hover:text-stone-600" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;