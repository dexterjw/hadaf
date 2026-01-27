import { useState } from 'react';
import { Save, User, Book, Calendar } from 'lucide-react';
import { UserSettings } from '@/features/prototype2/types/hafiz';

interface HafizSettingsProps {
    settings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
}

const HafizSettings: React.FC<HafizSettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState<UserSettings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' || name === 'startDate' ? value : Number(value)
        }));
        setIsSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const InputGroup = ({ label, name, type = "text", value, onChange, min, max, helpText }: {
        label: string;
        name: string;
        type?: string;
        value: string | number;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        min?: number;
        max?: number;
        helpText?: string;
    }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                min={min}
                max={max}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-foreground text-sm font-medium placeholder-muted-foreground"
            />
            {helpText && <p className="text-[10px] text-muted-foreground font-medium">{helpText}</p>}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">

                <div className="p-6 border-b border-border bg-secondary/50">
                    <h2 className="text-lg font-bold text-foreground">Profile & Configuration</h2>
                    <p className="text-muted-foreground mt-1 text-xs font-medium">Configure your journey parameters to update your projections.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Section: Personal Info */}
                    <div>
                        <div className="flex items-center gap-2 text-foreground font-bold mb-4">
                            <User size={16} className="text-muted-foreground" />
                            <h3>Personal Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Name" name="name" value={formData.name} onChange={handleChange} />
                            <InputGroup label="Start Date" name="startDate" type="date" value={formData.startDate.split('T')[0]} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="h-px bg-border w-full"></div>

                    {/* Section: Progress Info */}
                    <div>
                        <div className="flex items-center gap-2 text-foreground font-bold mb-4">
                            <Book size={16} className="text-muted-foreground" />
                            <h3>Current Status</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Current Page" name="currentPage" type="number" min={1} max={604} value={formData.currentPage} onChange={handleChange} />
                            <InputGroup label="Total Pages" name="totalPages" type="number" value={formData.totalPages} onChange={handleChange} helpText="Standard Madani Mushaf is 604 pages." />
                        </div>
                    </div>

                    <div className="h-px bg-border w-full"></div>

                    {/* Section: Goals */}
                    <div>
                        <div className="flex items-center gap-2 text-foreground font-bold mb-4">
                            <Calendar size={16} className="text-muted-foreground" />
                            <h3>Daily Targets</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Memorization (Pages/Day)" name="dailyGoalPages" type="number" value={formData.dailyGoalPages} onChange={handleChange} />
                            <InputGroup label="Revision (Pages/Day)" name="revisionGoalPages" type="number" value={formData.revisionGoalPages} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm border
                ${isSaved
                                    ? 'bg-accent/20 text-accent-foreground border-accent/30'
                                    : 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                                }`}
                        >
                            <Save size={16} />
                            {isSaved ? 'Saved Successfully' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default HafizSettings;
