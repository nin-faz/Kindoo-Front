import React, { useContext, useState } from 'react';
import { MessageCircle, Heart, Smile, Plus } from 'lucide-react';
import Modal from './Modal';
import { AuthContext } from '../context/AuthContext';

const WelcomeScreen: React.FC = () => {
  // Ajoute ici la logique pour ouvrir la modale ou lancer la création de conversation
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(AuthContext)!; // Assurez-vous que AuthContext est importé correctement 

  // Récupère l'id utilisateur depuis le localStorage
  const currentUserId = user?.id || '';

  const handleCreateConversation = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 p-8 relative">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Heart className="text-pink-500" size={24} />
            </div>
            <div className="h-16 w-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={32} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to kindoo!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your cute and friendly instant messenger. Select a chat to start messaging!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="text-purple-500" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Chat Instantly</h3>
            <p className="text-sm text-gray-500">Connect with friends in real-time</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smile className="text-pink-500" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Express Yourself</h3>
            <p className="text-sm text-gray-500">Share emotions with reactions and emojis</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="text-teal-500" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Stay Connected</h3>
            <p className="text-sm text-gray-500">Never miss a message from loved ones</p>
          </div>
        </div>
      </div>
      {/* Bouton plus en bas à droite */}
      <button
        onClick={handleCreateConversation}
        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors"
        aria-label="Créer une conversation"
      >
        <Plus size={28} />
      </button>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default WelcomeScreen;