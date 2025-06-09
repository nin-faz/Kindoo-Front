import { User, Chat, Message } from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'online',
  },
  {
    id: '2',
    name: 'Alex Kim',
    avatar: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'online',
    lastSeen: 'Just now'
  },
  {
    id: '3',
    name: 'Morgan Taylor',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'away',
    lastSeen: '3 minutes ago'
  },
  {
    id: '4',
    name: 'Sam Rodriguez',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'offline',
    lastSeen: '2 hours ago'
  },
  {
    id: '5',
    name: 'Jamie Chen',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'busy',
    lastSeen: '5 minutes ago'
  },
];

// Mock messages
const generateMessages = (chatId: string, participants: User[]): Message[] => {
  const messages: Message[] = [];
  
  if (chatId === '1') {
    messages.push(
      {
        id: '1',
        senderId: '2',
        content: 'Hey there! How are you doing today?',
        timestamp: '10:15 AM',
        isRead: true,
      },
      {
        id: '2',
        senderId: '1',
        content: 'I\'m good, thanks! Just working on a new project. How about you?',
        timestamp: '10:17 AM',
        isRead: true,
      },
      {
        id: '3',
        senderId: '2',
        content: 'That sounds exciting! I\'m just relaxing today 😊',
        timestamp: '10:20 AM',
        isRead: true,
      },
      {
        id: '4',
        senderId: '2',
        content: 'What kind of project are you working on?',
        timestamp: '10:21 AM',
        isRead: false,
      }
    );
  } else if (chatId === '2') {
    messages.push(
      {
        id: '5',
        senderId: '3',
        content: 'Did you see the new movie that came out last weekend?',
        timestamp: 'Yesterday',
        isRead: true,
      },
      {
        id: '6',
        senderId: '1',
        content: 'Not yet! Was it good?',
        timestamp: 'Yesterday',
        isRead: true,
      },
      {
        id: '7',
        senderId: '3',
        content: 'It was amazing! We should go watch it together sometime',
        timestamp: 'Yesterday',
        isRead: true,
      }
    );
  } else if (chatId === '3') {
    messages.push(
      {
        id: '8',
        senderId: '4',
        content: 'Hey, are we still meeting for coffee tomorrow?',
        timestamp: '2 days ago',
        isRead: true,
      },
      {
        id: '9',
        senderId: '1',
        content: 'Yes, definitely! How about 3pm at the usual place?',
        timestamp: '2 days ago',
        isRead: true,
      },
      {
        id: '10',
        senderId: '4',
        content: 'Perfect, see you then!',
        timestamp: '2 days ago',
        isRead: true,
      }
    );
  } else if (chatId === '4') {
    messages.push(
      {
        id: '11',
        senderId: '5',
        content: 'Can you send me those files we talked about?',
        timestamp: 'Monday',
        isRead: true,
      },
      {
        id: '12',
        senderId: '1',
        content: 'Sure thing! I\'ll email them to you shortly.',
        timestamp: 'Monday',
        isRead: true,
      },
      {
        id: '13',
        senderId: '5',
        content: 'Thanks! Much appreciated.',
        timestamp: 'Monday',
        isRead: true,
      }
    );
  }
  
  return messages;
};

// Mock chats
export const chats: Chat[] = [
  {
    id: '1',
    participants: [users[0], users[1]],
    messages: generateMessages('1', [users[0], users[1]]),
    unreadCount: 1,
    lastMessage: {
      id: '4',
      senderId: '2',
      content: 'What kind of project are you working on?',
      timestamp: '10:21 AM',
      isRead: false,
    }
  },
  {
    id: '2',
    participants: [users[0], users[2]],
    messages: generateMessages('2', [users[0], users[2]]),
    unreadCount: 0,
    lastMessage: {
      id: '7',
      senderId: '3',
      content: 'It was amazing! We should go watch it together sometime',
      timestamp: 'Yesterday',
      isRead: true,
    }
  },
  {
    id: '3',
    participants: [users[0], users[3]],
    messages: generateMessages('3', [users[0], users[3]]),
    unreadCount: 0,
    lastMessage: {
      id: '10',
      senderId: '4',
      content: 'Perfect, see you then!',
      timestamp: '2 days ago',
      isRead: true,
    }
  },
  {
    id: '4',
    participants: [users[0], users[4]],
    messages: generateMessages('4', [users[0], users[4]]),
    unreadCount: 0,
    lastMessage: {
      id: '13',
      senderId: '5',
      content: 'Thanks! Much appreciated.',
      timestamp: 'Monday',
      isRead: true,
    }
  },
];

// Get other user in a chat (not the current user)
export const getOtherParticipant = (chat: Chat, currentUserId: string): User => {
  const users = chat.participants;
  console.log('Chat participants:', users, 'Current user ID:', currentUserId);
  console.log('Other participant:',  users.find(user => String(user.id) !== String(currentUserId)));
  return users.find(user => String(user.id) !== String(currentUserId)) || users[0];
};