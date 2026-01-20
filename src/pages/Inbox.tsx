import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/client';
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
    <div className="max-w-2xl mx-auto py-10">
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-32 bg-gray-100 rounded"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold text-black mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-lg">
          <MessageSquareOff className="h-10 w-10 mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No conversations</p>
          <p className="text-sm text-gray-400 mt-1">Start chatting with sellers to see messages here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <Link key={conv.id} to={`/chat/${conv.id}`}>
              <div className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 border border-transparent hover:border-gray-200">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {conv.otherParticipant.profilePicUrl ? (
                    <img
                      src={conv.otherParticipant.profilePicUrl}
                      className="object-cover h-full w-full"
                      alt={conv.otherParticipant.name}
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-black text-sm truncate">
                      {conv.otherParticipant.name}
                    </h3>
                    {conv.unreadCount > 0 && (
                      <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.listing.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}