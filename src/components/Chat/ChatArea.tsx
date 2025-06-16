import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, Message } from '../../types';
import { getOtherParticipant } from '../../data/mock-data';
import Avatar from '../ui/Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { io, Socket } from 'socket.io-client';

const GET_MESSAGES = gql`
  query GetByConversationId($conversationId: String!) {
    getByConversationId(conversationId: $conversationId) {
      id
      content
      createdAt
      authorId
      conversationId
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($createMessageInput: CreateMessageInput!) {
    sendMessage(createMessageInput: $createMessageInput) {
      id
      content
      createdAt
      authorId
      conversationId
    }
  }
`;

interface ChatAreaProps {
  chat: Chat;
  currentUser: User;
}

// Use import.meta.env for Vite/React environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=U';


const ChatArea: React.FC<ChatAreaProps> = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUser = getOtherParticipant(chat, currentUser.id);

  // Récupère les messages initiaux
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId: chat.id },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setMessages(data?.getByConversationId || []);
    }
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // WebSocket: écoute les nouveaux messages
  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.emit('joinConversation', chat.id);

    socket.on('newMessage', (message: Message) => {
      if (message.conversationId === chat.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.emit('leaveConversation', chat.id);
      socket.disconnect();
    };
  }, [chat.id]);

  // Reset messages quand on change de chat
  useEffect(() => {
    setMessages(data?.getByConversationId || []);
  }, [chat.id, data]);

  // Scroll to bottom quand messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing effect (optionnel)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping]);

  // Envoi du message via mutation GraphQL
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setIsTyping(true);
    try {
      await sendMessage({
        variables: {
          createMessageInput: {
            content,
            authorId: currentUser.id,
            conversationId: chat.id,
          },
        },
      });
      // Le message sera reçu via le WebSocket (pas besoin de l'ajouter localement)
    } catch (e) {
      // Optionnel : gérer l'erreur
    } finally {
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur de chargement</div>;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Chat header */}
      <header className="px-4 py-3 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <Avatar 
            src={otherUser.avatar || DEFAULT_AVATAR} 
            alt={otherUser.userName} 
            status={otherUser.status} 
          />
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">{otherUser.userName}</h2>
            <p className="text-xs text-gray-500">
              {otherUser.status === 'online' 
                ? 'Online' 
                : `Last seen ${otherUser.lastSeen || 'N/A'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {(() => {
            let lastDate: string | null = null;
            return messages.map((message: Message) => {
              const messageDate = new Date(message.createdAt).toLocaleDateString();
              const showDateSeparator = messageDate !== lastDate;
              lastDate = messageDate;
              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-2">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow">
                        {messageDate}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={{
                      ...message,
                      createdAt: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }}
                    isOwn={message.authorId === currentUser.id}
                    senderAvatar={message.authorId === currentUser.id ? currentUser.avatar : otherUser.avatar || DEFAULT_AVATAR}
                  />
                </React.Fragment>
              );
            });
          })()}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;