'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchApi } from '@/lib/api';
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  Phone,
  MoreVertical,
  Building,
  UtensilsCrossed,
  Circle,
  Loader2,
  RefreshCw,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchConversations = async () => {
    setLoadingConvs(true);
    const res = await fetchApi('/chat/conversations');
    if (res.success && res.data) setConversations(res.data);
    setLoadingConvs(false);
  };

  const fetchMessages = async (convId: string) => {
    setLoadingMessages(true);
    const res = await fetchApi(`/chat/conversations/${convId}/messages`);
    if (res.success && res.data) setMessages(res.data);
    setLoadingMessages(false);

    // Scroll to bottom after messages load
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (isAuthenticated) fetchConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedConv) fetchMessages(selectedConv._id);
  }, [selectedConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConv || sending) return;
    setSending(true);

    const res = await fetchApi(`/chat/conversations/${selectedConv._id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text: messageText.trim() })
    });

    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data]);
      setMessageText('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
    setSending(false);
  };

  const getOtherParticipant = (conv: any) => {
    if (!user) return conv.participants?.[0];
    return conv.participants?.find((p: any) => p._id !== user._id);
  };

  const filteredConvs = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return !searchTerm || other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md text-center shadow-sm border border-slate-100 space-y-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to view messages</h2>
          <p className="text-slate-500 text-sm">Chat with property owners and mess providers directly.</p>
          <a href="/auth/login" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-white flex overflow-hidden">
      {/* Sidebar: Conversations List */}
      <aside
        className={`${
          selectedConv ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-80 lg:w-96 border-r border-slate-100 bg-white`}
      >
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-lg font-black text-slate-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loadingConvs ? (
            <div className="p-8 text-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-500" />
              <p className="text-xs">Loading conversations...</p>
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto opacity-30" />
              <div>
                <p className="text-sm font-semibold text-slate-700">No conversations yet</p>
                <p className="text-xs mt-1">
                  Contact a room or mess owner to start a chat.
                </p>
              </div>
              <a
                href="/rooms"
                className="inline-block mt-2 text-xs font-bold text-teal-600 hover:underline"
              >
                Browse Rooms & Messes →
              </a>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const other = getOtherParticipant(conv);
              const isSelected = selectedConv?._id === conv._id;
              const lastMsg = conv.lastMessage;
              return (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50/80 transition ${
                    isSelected ? 'bg-teal-50/80 border-r-2 border-teal-500' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    {other?.name ? other.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 truncate">{other?.name || 'Unknown'}</span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {new Date(lastMsg.createdAt || Date.now()).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {lastMsg ? lastMsg.text : 'Start a conversation...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden`}>
        {!selectedConv ? (
          <div className="flex-1 flex items-center justify-center text-center text-slate-400 p-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-700">Select a conversation</p>
                <p className="text-sm mt-1 text-slate-400">
                  Click on a conversation from the left panel to read and send messages.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-white shadow-sm">
              <button
                onClick={() => setSelectedConv(null)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-lg flex items-center justify-center">
                {getOtherParticipant(selectedConv)?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">
                  {getOtherParticipant(selectedConv)?.name || 'Contact'}
                </div>
                <div className="text-xs text-slate-500 capitalize">
                  {getOtherParticipant(selectedConv)?.role?.replace('_', ' ')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getOtherParticipant(selectedConv)?.phone && (
                  <a
                    href={`tel:${getOtherParticipant(selectedConv)?.phone}`}
                    className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-teal-500" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-slate-400 space-y-3 flex-col">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                  <div>
                    <p className="font-semibold text-slate-600">No messages yet</p>
                    <p className="text-xs mt-1">Send a message to start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user?._id || msg.senderId?._id === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isOwn
                            ? 'bg-teal-600 text-white rounded-tr-sm'
                            : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={`text-[10px] mt-1 ${isOwn ? 'text-teal-200 text-right' : 'text-slate-400'}`}>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                            : 'now'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 px-4 py-3.5 border-t border-slate-100 bg-white"
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-sm transition disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
