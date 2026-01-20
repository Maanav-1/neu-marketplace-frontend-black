import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatMessage, Conversation } from '@/types/chat';

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchChatData = async () => {
    try {
      const { data: msgData } = await api.get(`/conversations/${conversationId}/messages`);

      if (msgData.length > prevMessageCountRef.current) {
        prevMessageCountRef.current = msgData.length;
        setMessages(msgData);
        setTimeout(scrollToBottom, 100);
      } else {
        setMessages(msgData);
      }

      const { data: convData } = await api.get(`/conversations/${conversationId}`);
      setConversation(convData);

      await api.patch(`/conversations/${conversationId}/read`);
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  useEffect(() => {
    fetchChatData();
    const interval = setInterval(fetchChatData, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      await api.post(`/conversations/${conversationId}/messages`, { content: newMessage });
      setNewMessage('');
      await fetchChatData();
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setSending(false);
    }
  };

  // Calculate height to fill remaining viewport
  // Navbar ~64px, main padding ~48px (py-6 = 24px * 2)
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header - Fixed */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50 shrink-0">
        <Link to="/inbox">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 h-9 w-9">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-900 truncate">
            {conversation?.otherParticipant.name}
          </h2>
          <p className="text-sm text-slate-500 truncate">
            Re: {conversation?.listing.title}
          </p>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-slate-400 py-10">No messages yet. Start the conversation!</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.isOwnMessage
                ? 'bg-indigo-600 text-white rounded-br-md'
                : 'bg-slate-100 text-slate-700 rounded-bl-md'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed */}
      <form onSubmit={handleSend} className="px-5 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex gap-3">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 h-11 bg-white border-slate-200 rounded-xl"
        />
        <Button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl"
        >
          {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
}