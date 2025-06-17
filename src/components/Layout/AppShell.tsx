import React, { useEffect, useContext, useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from '../Chat/ChatArea';
import { Chat } from '../../types';
import WelcomeScreen from './WelcomeScreen';
import AuthPage from './auth/AuthPage';
import { AuthContext } from '../context/AuthContext';

const AppShell: React.FC = () => {
  const { user, verifyToken, logout } = useContext(AuthContext)!;
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [availableChats] = useState<Chat[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  // Vérification de la validité du token au chargement et quand il change
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken();
      if (!isValid) {
        logout();
        setShowWelcome(false);
      }
    };
    checkToken();
  }, [verifyToken, logout]);

  useEffect(() => {
    // Vérifie si un user est présent dans le localStorage ou dans le contexte
    const storedUser = localStorage.getItem('user');
    if (user || storedUser) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {showWelcome ? (
       <>
          {user && (
            <Sidebar
              currentUser={user}
              chats={availableChats}
              activeChat={activeChat}
              onChatSelect={setActiveChat}
            />
          )}
          <main className="flex-1 flex flex-col h-full">
            {activeChat && user ? (
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
