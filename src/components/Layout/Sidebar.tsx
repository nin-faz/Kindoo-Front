import React, { useState } from 'react';
import { Chat, User } from '../../types';
import Avatar from '../ui/Avatar';
import { Search, MessageCircle, Settings, Menu, X } from 'lucide-react';
import { getOtherParticipant } from '../../data/mock-data';
import { useQuery, gql } from '@apollo/client';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
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

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=U';


const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  activeChat, 
  onChatSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  console.log('Current User:', currentUser);

  const { data, loading, error } = useQuery(GET_CONVERSATIONS_BY_PARTICIPANT, {
    variables: { p_participantId: currentUser.id },
    fetchPolicy: 'network-only',
  });

  const chats = data?.findByParticipantId || [];
  console.log('Chats:', chats);

  const filteredChats = chats.filter((chat: any) => {
    const otherUser = getOtherParticipant(chat, currentUser.id);
    return otherUser?.userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                kindoo
              </h1>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings size={20} />
            </button>
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
            {filteredChats.length > 0 ? (
              <ul>
                {filteredChats.map((chat: any) => {
                  const otherUser = getOtherParticipant(chat, currentUser.id);
                  const isActive = activeChat?.id === chat.id;
                  console.log('Chat:', chat, 'Other User:', otherUser);
                  
                  return (
                    <li key={chat.id}>
                      <button
                        className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200
                                   ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          onChatSelect(chat);
                          if (mobileOpen) setMobileOpen(false);
                        }}
                      >
                        <Avatar 
                          src={DEFAULT_AVATAR} 
                          alt={otherUser.userName} 
                        />
                        <div className="ml-3 flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{otherUser.userName}</span>
                            <span className="text-xs text-gray-500">{chat.lastMessage?.timestamp}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 truncate max-w-[160px]">
                              {chat.lastMessage?.content}
                            </p>
                            {chat.unreadCount > 0 && (
                              <span className="ml-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No chats found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar 
              src={DEFAULT_AVATAR} 
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