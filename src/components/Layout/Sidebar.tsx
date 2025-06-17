import React, { act, useContext, useEffect, useState } from 'react';
import { Chat, Message, User } from '../../types';
import Avatar from '../ui/Avatar';
import { Search, MessageCircle, Settings, Menu, X, LogOut } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat | null) => void;
}

const GET_CONVERSATIONS_BY_PARTICIPANT = gql`
  query GetConversationsByParticipant($p_participantId: String!) {
    findByParticipantId(p_participantId: $p_participantId) {
      id
      participants {
        id
        userName
      }
    }
  }
`;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const getOtherParticipant = (chat: Chat, currentUserId: string): User => {
  const users = chat.participants;
  console.log('Chat participants:', users, 'Current user ID:', currentUserId);
  console.log('Other participant:',  users.find(user => String(user.id) !== String(currentUserId)));
  return users.find(user => String(user.id) !== String(currentUserId)) || users[0];
};

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  activeChat, 
  onChatSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useContext(AuthContext)!; 

  const { data, loading, error, refetch } = useQuery(GET_CONVERSATIONS_BY_PARTICIPANT, {
    variables: { p_participantId: currentUser.id },
    fetchPolicy: 'network-only',
  });

    // Rafraîchit automatiquement la liste des conversations toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);
    return () => clearInterval(interval);
  }, [refetch]);

const [newMessageChatIds, setNewMessageChatIds] = useState<string[]>([]);

useEffect(() => {
  const socket: Socket = io(SOCKET_URL, { transports: ['websocket'] });

  socket.on('newMessage', (message: Message) => {
    if (
      message.authorId !== currentUser.id && 
      message.conversationId !== activeChat?.id
    ) {

      setNewMessageChatIds((prev) => {
        if (!prev.includes(message.conversationId)) {
          return [...prev, message.conversationId];
        }
        return prev;
      });
    }
  });

  return () => {
    socket.disconnect();
  };
}, [currentUser.id, activeChat?.id]);

console.log('new message chat ids:', newMessageChatIds);  

  
  const chats = data?.findByParticipantId || [];
  console.log('Chats:', chats);

  const filteredChats = chats.filter((chat: any) => {
    const otherUser = getOtherParticipant(chat, currentUser.id);
    return otherUser?.userName.toLowerCase().includes(searchQuery.toLowerCase());
  });


  const getUserAvatar = (username: string) => {
    const firstLetter = username.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=${firstLetter}`;
  }


  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full bg-white shadow-md text-purple-500"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`bg-white w-80 h-full flex flex-col border-r border-gray-200 shadow-md
                    transition-all duration-300 ease-in-out z-40
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageCircle className="text-purple-500" size={24} />
              <button
                type="button"
                className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-block focus:outline-none"
                onClick={() => onChatSelect(null)}
                style={{ border: 'none', padding: 0, cursor: 'pointer' }}
                aria-label="Accueil Kindoo"
              >
                kindoo
              </button>

            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-gray-700">
                <Settings size={20} />
              </button>
              <button
                className="text-gray-500 hover:text-red-500"
                title="Se déconnecter"
                onClick={logout}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Recent Chats
            </h2>
            {loading ? (
            <div className="text-center text-gray-400 mt-8">Loading</div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No chats found</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredChats.map((chat: any) => {
                const otherUser = getOtherParticipant(chat, currentUser.id);
                return (
                  <li
                    key={chat.id}
                    className={`cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition
                      ${activeChat && activeChat.id === chat.id ? 'bg-purple-100' : ''}`}
                    onClick={() => {
                      onChatSelect(chat);
                      setNewMessageChatIds((prev) => prev.filter((id) => id !== chat.id));
                    }}
                  >
                    <Avatar
                      src={getUserAvatar(otherUser.userName)}
                      alt={otherUser.userName}
                      size="md"
                    />
                    <span className="font-medium text-gray-800">{otherUser.userName}</span>
                    {newMessageChatIds.includes(chat.id) && (
                      <span className="ml-auto text-xs text-red-500">
                        New message
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar 
              src={getUserAvatar(currentUser.userName)} 
              alt={currentUser.userName} 
            />
            <div className="ml-3">
              <p className="font-medium text-gray-900">{currentUser.userName}</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;