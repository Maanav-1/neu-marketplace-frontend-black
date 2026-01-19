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
      // 1. Get messages
      const { data: msgData } = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(msgData);
      
      // 2. Get conversation metadata
      const { data: convData } = await api.get(`/conversations/${conversationId}`);
      setConversation(convData);
      
      // 3. Mark as read
      await api.patch(`/conversations/${conversationId}/read`);
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  useEffect(() => {
    fetchChatData();
    const interval = setInterval(fetchChatData, 3000); // Poll every 3 seconds
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
      fetchChatData(); // Immediate refresh after sending
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-2xl h-[85vh] flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-950">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft size={18}/></Button>
        <div>
          <h2 className="font-bold text-sm">{conversation?.otherParticipant.name}</h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{conversation?.listing.title}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.isOwnMessage 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-2">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-zinc-900 border-zinc-800 focus:ring-blue-600"
        />
        <Button type="submit" size="icon" disabled={sending || !newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
          {sending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
}