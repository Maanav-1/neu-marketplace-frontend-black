export interface ParticipantInfo {
  id: number;
  name: string;
  profilePicUrl?: string;
}

export interface ListingInfo {
  id: number;
  slug: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  status: string;
}

export interface Conversation {
  id: number;
  listing: ListingInfo;
  otherParticipant: ParticipantInfo;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isBuyer: boolean;
  isSeller: boolean;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  sender: ParticipantInfo;
  content: string;
  isRead: boolean;
  isOwnMessage: boolean;
  createdAt: string;
}