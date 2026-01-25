import { useState } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface HafizAICoachProps {
    userName: string;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const HafizAICoach: React.FC<HafizAICoachProps> = ({ userName }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Salam ${userName}! I am your Hifz companion. You can ask me about Tajweed rules, Tafsir of the verses you are memorizing, or for motivation to keep going.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            const reply = data.reply || "I'm having trouble connecting right now, please try again.";
            setMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "SubhanAllah, I encountered a temporary error. Please check your connection or try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-card rounded-2xl shadow-sm border border-border overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-orange-400 shadow-sm">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h2 className="font-bold text-foreground text-sm">AI Companion</h2>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Powered by Gemini AI</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dots-dark">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border
                 ${msg.role === 'user' ? 'bg-secondary border-border text-muted-foreground' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                            </div>

                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-secondary text-foreground border border-border rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium ml-10 bg-secondary px-3 py-1 rounded-full border border-border shadow-sm">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Processing...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about a verse, tafsir, or schedule..."
                        className="w-full pl-5 pr-12 py-3.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-muted focus:border-muted-foreground transition-all text-foreground text-sm font-medium placeholder-muted-foreground"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-card border border-border hover:bg-secondary text-muted-foreground rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HafizAICoach;
