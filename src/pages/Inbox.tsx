import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquareOff, User } from 'lucide-react';
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

  if (loading) return (
    <div className="container py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <MessageSquareOff className="h-12 w-12 mb-4 text-slate-300" />
          <p className="font-medium">No conversations yet.</p>
          <p className="text-sm text-slate-400 mt-1">Start chatting with sellers to see messages here.</p>
        </div>
      ) : (
        <ScrollArea className="h-[70vh]">
          <div className="space-y-3 pr-4">
            {conversations.map((conv) => (
              <Link key={conv.id} to={`/chat/${conv.id}`}>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card className="p-4 bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200">
                      {conv.otherParticipant.profilePicUrl ? (
                        <img
                          src={conv.otherParticipant.profilePicUrl}
                          className="object-cover h-full w-full"
                          alt={conv.otherParticipant.name}
                        />
                      ) : (
                        <User className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {conv.otherParticipant.name}
                        </h3>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Re: <span className="text-slate-700 font-medium">{conv.listing.title}</span>
                      </p>
                      <p className="text-sm text-slate-400 mt-1 truncate">
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