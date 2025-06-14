import React from 'react';
import { Message } from '../../types';
import Avatar from '../ui/Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderAvatar: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn,
  senderAvatar
}) => {
  return (
    <div className={`flex items-end space-x-2 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {!isOwn && <Avatar src={senderAvatar} alt="Sender" size="sm" />}
      
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm
                   ${isOwn 
                     ? 'bg-purple-500 text-white rounded-br-none' 
                     : 'bg-white text-gray-800 rounded-bl-none'}`}
      >
        <p>{message.content}</p>
        <span className={`text-xs block mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
          {message.createdAt}
        </span>
      </div>
      
      {message.reactions && message.reactions.length > 0 && (
        <div className={`absolute -bottom-2 ${isOwn ? 'right-10' : 'left-10'}`}>
          <div className="bg-white rounded-full shadow-md px-2 py-1 flex">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-sm">{reaction.emoji}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;