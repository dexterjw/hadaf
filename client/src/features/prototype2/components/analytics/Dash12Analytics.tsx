import { useState } from 'react';
import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import JourneyAnalyticsV1 from './AnalyticsV1';
import JourneyAnalyticsV2 from './AnalyticsV2';
import JourneyAnalyticsV3 from './AnalyticsV3';

interface Dash12AnalyticsProps {
    settings: UserSettings;
    stats: CompletionData;
}

type AnalyticsVariation = 'v1' | 'v2' | 'v3';

const Dash12Analytics: React.FC<Dash12AnalyticsProps> = ({ settings, stats }) => {
    const [variation, setVariation] = useState<AnalyticsVariation>('v1');

    return (
        <div className="h-full flex flex-col">
            {/* Top Controls: Variation Switcher */}
            <div className="flex justify-end mb-6">
                <div className="bg-secondary/50 p-1 rounded-lg flex items-center gap-1 border border-border/50">
                    <button
                        onClick={() => setVariation('v1')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${variation === 'v1' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setVariation('v2')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${variation === 'v2' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Cards
                    </button>
                    <button
                        onClick={() => setVariation('v3')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${variation === 'v3' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Minimal
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                {variation === 'v1' && <JourneyAnalyticsV1 settings={settings} stats={stats} />}
                {variation === 'v2' && <JourneyAnalyticsV2 settings={settings} stats={stats} />}
                {variation === 'v3' && <JourneyAnalyticsV3 settings={settings} stats={stats} />}
            </div>
        </div>
    );
};

export default Dash12Analytics;
