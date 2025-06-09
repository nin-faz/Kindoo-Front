import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md',
  status
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-500'
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ${statusColors[status]} ring-2 ring-white`}
          style={{ width: size === 'sm' ? '8px' : size === 'md' ? '10px' : '12px', height: size === 'sm' ? '8px' : size === 'md' ? '10px' : '12px' }}
        />
      )}
    </div>
  );
};

export default Avatar;