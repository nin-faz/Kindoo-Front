import React, { useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import ChatArea from '../Chat/ChatArea';
import { useState } from 'react';
import { Chat, User } from '../../types';
import { chats } from '../../data/mock-data';
import WelcomeScreen from './WelcomeScreen';
import AuthPage from './auth/AuthPage';
import { AuthContext } from '../context/AuthContext';

const AppShell: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [availableChats] = useState<Chat[]>(chats);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {user ? (
        <>
          <Sidebar
            currentUser={user}
            chats={availableChats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
          />
          <main className="flex-1 flex flex-col h-full">
            {activeChat ? (
              <ChatArea
                chat={activeChat}
                currentUser={user}
              />
            ) : (
              <WelcomeScreen />
            )}
          </main>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 p-8">
          <div className="w-full max-w-md">
            <AuthPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppShell;