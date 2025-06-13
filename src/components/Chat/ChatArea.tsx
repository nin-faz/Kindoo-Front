import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, Message } from '../../types';
import { getOtherParticipant } from '../../data/mock-data';
import Avatar from '../ui/Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_MESSAGES = gql`
  query getByConversationId($conversationId: String!) {
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

const ChatArea: React.FC<ChatAreaProps> = ({ chat, currentUser }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUser = getOtherParticipant(chat, currentUser.id);

  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { conversationId: chat.id },
    fetchPolicy: 'network-only',
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Reset local messages when chat changes or messages sont rechargés
  useEffect(() => {
    setLocalMessages([]);
  }, [chat.id, data]);

  // Scroll to bottom when messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data, localMessages]);

  // Simulate typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    // Ajoute le message localement pour affichage instantané
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      authorId: currentUser.id,
      conversationId: chat.id,
    };
    setLocalMessages((prev) => [...prev, tempMessage]);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);

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
      // Optionnel : tu peux refetch ici si tu veux la vraie version du backend
      // refetch();
    } catch (e) {
      // Optionnel : gérer l'erreur et retirer le message local si besoin
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur de chargement</div>;

  // Utilise la bonne clé selon ta requête GraphQL
  const messages = [
    ...(data?.getByConversationId || []),
    ...localMessages
  ];


  console.log('Messages:', messages);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Chat header */}
      <header className="px-4 py-3 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <Avatar 
            src={otherUser.avatar} 
            alt={otherUser.userName} 
            status={otherUser.status} 
          />
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">{otherUser.userName}</h2>
            <p className="text-xs text-gray-500">
              {otherUser.status === 'online' 
                ? 'Online' 
                : `Last seen ${otherUser.lastSeen}`
              }
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
          {messages.map((message: Message) => (
            <MessageBubble
              key={message.id}
              message={{
                ...message,
                createdAt: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }}
              isOwn={message.authorId === currentUser.id}
              senderAvatar={message.authorId === currentUser.id ? currentUser.avatar : otherUser.avatar}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-end space-x-2">
              <Avatar src={otherUser.avatar} alt={otherUser.userName} size="sm" />
              <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;