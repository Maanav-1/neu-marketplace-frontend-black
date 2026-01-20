import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage, Conversation } from '@/types/chat';

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChatData = async () => {
    try {
      const { data: msgData } = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(msgData);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await api.post(`/conversations/${conversationId}/messages`, { content: newMessage });
      setNewMessage('');
      fetchChatData();
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-2xl h-[85vh] flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">{conversation?.otherParticipant.name}</h2>
          <p className="text-xs text-slate-500">{conversation?.listing.title}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/50">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.isOwnMessage
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !newMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 h-10 w-10"
        >
          {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
}