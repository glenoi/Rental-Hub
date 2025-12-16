import React, { useState } from 'react';
import { Lock, Send, User } from 'lucide-react';

interface Props {
  isLocked: boolean;
  ownerName: string;
}

const ChatInterface: React.FC<Props> = ({ isLocked, ownerName }) => {
  const [messages, setMessages] = useState<{id: number, text: string, isMe: boolean}[]>([
    { id: 1, text: `Hi, I'm interested in your property. My profile has been submitted.`, isMe: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, isMe: true }]);
    setInput("");
  };

  if (isLocked) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[400px]">
        <div className="bg-slate-200 p-4 rounded-full mb-4">
          <Lock size={32} className="text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chat Locked</h3>
        <p className="text-slate-500 max-w-sm">
          You must pass the <b>Pre-Screening</b> and receive Owner Approval before you can chat or schedule a viewing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-lg">
      <div className="bg-teal-700 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User size={20} />
        </div>
        <div>
            <h3 className="font-bold">{ownerName}</h3>
            <span className="text-xs text-teal-100 flex items-center gap-1">● Online</span>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
        <div className="flex justify-center">
            <span className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">Today</span>
        </div>
        
        {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isMe ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                    {msg.text}
                </div>
            </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
        <input 
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;