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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const lastMsgHashRef = useRef("");

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const fetchChatData = async () => {
    try {
      const { data: msgData } = await api.get(`/conversations/${conversationId}/messages`);
      const newHash = JSON.stringify(msgData);

      if (newHash !== lastMsgHashRef.current) {
        const isNewMessages = msgData.length > prevMessageCountRef.current;
        const isFirstLoad = prevMessageCountRef.current === 0;

        // Check if user is near bottom BEFORE updating state
        // (Use a small threshold like 100px)
        const container = scrollContainerRef.current;
        const isNearBottom = container
          ? container.scrollHeight - container.scrollTop - container.clientHeight < 100
          : true; // Default to true if not found (shouldn't happen)

        prevMessageCountRef.current = msgData.length;
        lastMsgHashRef.current = newHash;
        setMessages(msgData);

        // Only auto-scroll if it's the first load OR user is already at the bottom
        if (isNewMessages && (isFirstLoad || isNearBottom)) {
          setTimeout(scrollToBottom, 100);
        }
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

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 shrink-0">
        <Link to="/inbox">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-black text-sm truncate">
            {conversation?.otherParticipant.name}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {conversation?.listing.title}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">No messages yet. Start the conversation!</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.isOwnMessage
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-200 shrink-0 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-9 bg-white border-gray-200 focus:border-gray-400 focus:ring-0 text-sm"
        />
        <Button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-black hover:bg-gray-800 h-9 w-9"
          size="icon"
        >
          {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </Button>
      </form>
    </div>
  );
}