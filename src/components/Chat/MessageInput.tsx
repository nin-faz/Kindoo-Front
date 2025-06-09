import React, { useState } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip size={20} />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
          />
          <button 
            type="button"
            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          >
            <Smile size={20} />
          </button>
        </div>
        
        {message.trim() ? (
          <button 
            type="submit"
            className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        ) : (
          <button 
            type="button"
            className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Mic size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;