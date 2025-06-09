export interface User {
  id: string;
  userName: string;
}

export interface Message {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  conversationId: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
}