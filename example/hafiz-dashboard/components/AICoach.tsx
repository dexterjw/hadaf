import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface AICoachProps {
  userName: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AICoach: React.FC<AICoachProps> = ({ userName }) => {
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
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: `You are a supportive, knowledgeable Quran teacher and Hifz coach. Keep answers concise, encouraging, and spiritually uplifting. User asks: ${userMsg}` }
                    ]
                }
            ]
        });

        const reply = response.text || "I'm having trouble connecting right now, please try again.";
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "SubhanAllah, I encountered a temporary error. Please check your connection or API key." }]);
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
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-orange-600 shadow-sm">
                 <Sparkles size={16} />
             </div>
             <div>
                 <h2 className="font-bold text-stone-900 text-sm">AI Companion</h2>
                 <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">Powered by Gemini 3 Flash</p>
             </div>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dots">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               
               <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border
                 ${msg.role === 'user' ? 'bg-stone-100 border-stone-200 text-stone-500' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                 {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
               </div>

               <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                 ${msg.role === 'user' 
                   ? 'bg-stone-900 text-white rounded-tr-sm' 
                   : 'bg-white text-stone-700 border border-stone-200 rounded-tl-sm'}`}>
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="flex items-center gap-2 text-stone-400 text-xs font-medium ml-10 bg-white px-3 py-1 rounded-full border border-stone-100 shadow-sm">
                     <Loader2 size={12} className="animate-spin" />
                     <span>Processing...</span>
                 </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a verse, tafsir, or schedule..."
                className="w-full pl-5 pr-12 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all text-stone-800 text-sm font-medium placeholder-stone-400"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
                <Send size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;