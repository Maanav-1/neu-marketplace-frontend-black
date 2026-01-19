import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquareOff } from 'lucide-react';
import type { Conversation } from '@/types/chat';

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const { data } = await api.get('/conversations');
        setConversations(data);
      } catch (err) {
        console.error("Failed to fetch inbox", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  if (loading) return <div className="container py-10 animate-pulse">Loading inbox...</div>;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Messages</h1>
      
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          <MessageSquareOff className="h-12 w-12 mb-4 opacity-20" />
          <p>No conversations yet.</p>
        </div>
      ) : (
        <ScrollArea className="h-[70vh]">
          <div className="space-y-3 pr-4">
            {conversations.map((conv) => (
              <Link key={conv.id} to={`/chat/${conv.id}`}>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card className="p-4 bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-zinc-900 overflow-hidden flex-shrink-0">
                      <img 
                        src={conv.otherParticipant.profilePicUrl || '/placeholder-user.png'} 
                        className="object-cover h-full w-full"
                        alt={conv.otherParticipant.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm truncate">{conv.otherParticipant.name}</h3>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-blue-600 hover:bg-blue-600">{conv.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 truncate">
                        Re: <span className="text-zinc-300 font-medium">{conv.listing.title}</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 truncate italic">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}