import React from 'react';
import { UserSettings, CompletionData } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Flag, TrendingUp, Zap } from 'lucide-react';

interface AnalyticsProps {
  settings: UserSettings;
  stats: CompletionData;
}

const Analytics: React.FC<AnalyticsProps> = ({ settings, stats }) => {
  
  const generateChartData = () => {
    const data = [];
    const totalPages = settings.totalPages;
    const startPage = settings.startPage;
    const current = settings.currentPage;
    const projectedEnd = stats.estimatedCompletionDate;
    
    const startDate = new Date(settings.startDate);
    const today = new Date();
    
    data.push({
      name: 'Start',
      actual: startPage,
      projected: startPage,
      date: startDate.toLocaleDateString()
    });

    data.push({
      name: 'Today',
      actual: current,
      projected: current,
      date: today.toLocaleDateString()
    });

    for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const daysFromNow = i * 30;
        const projectedPage = Math.min(totalPages, current + (daysFromNow * settings.dailyGoalPages));
        
        data.push({
            name: `Month ${i}`,
            projected: projectedPage,
            date: futureDate.toLocaleDateString()
        });
    }

    data.push({
        name: 'Finish',
        projected: totalPages,
        date: projectedEnd.toLocaleDateString()
    });

    return data;
  };

  const chartData = generateChartData();

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass, bgClass }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
                <Icon size={18} />
            </div>
            {/* Optional dot indicator */}
            <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')} opacity-40`}></div>
        </div>
        <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</span>
            <h3 className="text-2xl font-bold text-stone-900 mt-1">{value}</h3>
            <p className="text-xs text-stone-500 mt-1 font-medium">{subtext}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full pb-8">
      
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={Flag}
            label="Est. Finish"
            value={stats.estimatedCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            subtext="Based on current pace"
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
        />
        <StatCard 
            icon={Zap}
            label="Velocity"
            value={`${settings.dailyGoalPages} pgs/day`}
            subtext="Consistent streak"
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
        />
        <StatCard 
            icon={Calendar}
            label="Time Left"
            value={`${stats.daysRemaining} days`}
            subtext={`Approx. ${Math.round(stats.daysRemaining / 30)} months`}
            colorClass="text-orange-600"
            bgClass="bg-orange-50"
        />
        <StatCard 
            icon={TrendingUp}
            label="Progress"
            value={`${stats.pagesRemaining} left`}
            subtext={`${stats.juzCompleted} / 30 Juz Done`}
            colorClass="text-purple-600"
            bgClass="bg-purple-50"
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-8 px-2">
           <div>
              <h3 className="text-lg font-bold text-stone-900">Completion Projection</h3>
              <p className="text-stone-500 text-xs font-medium mt-1">Actual progress vs. estimated trajectory to Khatam</p>
           </div>
           <div className="flex bg-stone-100 p-1 rounded-lg">
             <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-stone-800 border border-stone-200">Linear</button>
             <button className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-700">Adaptive AI</button>
           </div>
        </div>
        
        <div className="flex-1 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d6d3d1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d6d3d1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 500}} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 500}} 
                    domain={[0, 604]}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#a8a29e" 
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProjected)" 
                    name="Projected"
                />
                <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorActual)" 
                    name="Actual"
                />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;