import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Shield,
  Clock,
  CheckCheck,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Message } from '../../types';

export const MessagesView: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() => StorageService.getMessages());
  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');

  // Determine conversation partners
  const defaultPartner = role === 'patient'
    ? { id: 'user-doc-1', name: 'Dr. Emily Carter, MD', role: 'doctor' }
    : { id: 'user-pat-1', name: 'Sarah Johnson', role: 'patient' };

  const [activePartner, setActivePartner] = useState(defaultPartner);

  const currentThread = messages.filter(
    m =>
      (m.senderId === currentUser?.id && m.receiverId === activePartner.id) ||
      (m.senderId === activePartner.id && m.receiverId === currentUser?.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${currentUser.id}-${activePartner.id}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: activePartner.id,
      receiverName: activePartner.name,
      receiverRole: activePartner.role as any,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    StorageService.addMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Secure Clinical Messaging
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Direct, encrypted communication channel between patients and their care team.
        </p>
      </div>

      {/* Main Messaging Container */}
      <div className="h-[620px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Conversation Partner List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/60">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {role === 'patient' ? (
              <>
                <button
                  onClick={() =>
                    setActivePartner({
                      id: 'user-doc-1',
                      name: 'Dr. Emily Carter, MD',
                      role: 'doctor',
                    })
                  }
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    activePartner.id === 'user-doc-1'
                      ? 'bg-teal-50/80 dark:bg-slate-800/80'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    EC
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Dr. Emily Carter, MD
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Cardiology Specialist</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      "See you shortly in Suite 402."
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setActivePartner({
                      id: 'user-doc-2',
                      name: 'Dr. James Wilson, MD',
                      role: 'doctor',
                    })
                  }
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    activePartner.id === 'user-doc-2'
                      ? 'bg-teal-50/80 dark:bg-slate-800/80'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    JW
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Dr. James Wilson, MD
                    </p>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">General Primary Care</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      "Annual checkup scheduled."
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    setActivePartner({
                      id: 'user-pat-1',
                      name: 'Sarah Johnson',
                      role: 'patient',
                    })
                  }
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    activePartner.id === 'user-pat-1'
                      ? 'bg-teal-50/80 dark:bg-slate-800/80'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    SJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Sarah Johnson
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">HV-PAT-1082</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      "Thank you Dr. Carter! I have all my readings..."
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setActivePartner({
                      id: 'user-pat-2',
                      name: 'Michael Brown',
                      role: 'patient',
                    })
                  }
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    activePartner.id === 'user-pat-2'
                      ? 'bg-teal-50/80 dark:bg-slate-800/80'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    MB
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Michael Brown
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">HV-PAT-1083</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      "Stress test results ready?"
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                {activePartner.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {activePartner.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Encrypted Channel</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">HIPAA Protected</span>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {currentThread.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                No previous messages with {activePartner.name}. Send a secure note below.
              </div>
            ) : (
              currentThread.map(m => {
                const isMe = m.senderId === currentUser?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{m.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && <CheckCheck size={12} className="text-teal-500" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              required
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Write a message to ${activePartner.name}...`}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
