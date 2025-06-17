import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, Message } from '../../types';
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

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const getOtherParticipant = (chat: Chat, currentUserId: string): User => {
  const users = chat.participants;
  console.log('Chat participants:', users, 'Current user ID:', currentUserId);
  console.log('Other participant:',  users.find(user => String(user.id) !== String(currentUserId)));
  return users.find(user => String(user.id) !== String(currentUserId)) || users[0];
};

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

  const getUserAvatar = (username: string) => {
    const firstLetter = username.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=${firstLetter}`;
  }

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // WebSocket: écoute les nouveaux messages
    useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.emit('joinConversation', chat.id);

    socket.on('newMessage', (message: Message) => {
      if (message.conversationId === chat.id) {
        // Si ce n'est pas le message de l'utilisateur courant, effet typing
        if (message.authorId !== currentUser.id) {
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [...prev, message]);
            setIsTyping(false);
          }, 800); // délai effet typing
        } else {
          // Si c'est le message de l'utilisateur courant, affiche direct
          setMessages((prev) => [...prev, message]);
        }
      }
    });

    return () => {
      socket.emit('leaveConversation', chat.id);
      socket.disconnect();
    };
  }, [chat.id, currentUser.id]);

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
    let timeout: ReturnType<typeof setTimeout>;
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
      console.error('Erreur lors de l\'envoi du message:', e);
    }
  };

  if (loading) 
  return (
    <div className="flex justify-center items-center min-h-screen">
      <svg className="animate-spin h-16 w-16 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
  if (error){
    console.error('Error loading messages:', error);
    return <div>Error loading messages</div>;
  } 

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Chat header */}
      <header className="px-4 py-3 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <Avatar 
            src={getUserAvatar(otherUser.userName)} 
            alt={otherUser.userName} 
          />
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">{otherUser.userName}</h2>
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
                    senderAvatar={message.authorId === currentUser.id ? getUserAvatar(currentUser.userName) : getUserAvatar(otherUser.userName)}
                  />
                </React.Fragment>
              );
            });
          })()}
          {isTyping && (
            <div className="flex items-end space-x-2">
              <Avatar src={getUserAvatar(otherUser.userName)} alt={otherUser.userName} size="sm" />
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
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;