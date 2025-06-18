import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useLazyQuery } from '@apollo/client';
import Avatar from '../ui/Avatar';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      userName
    }
  }
`;

const FIND_CONVERSATION_BY_PARTICIPANTS = gql`
  query FindByParticipants($p_participantsIds: [String!]!) {
    findByParticipants(p_participantsIds: $p_participantsIds) {
      id
      participants {
        id
        userName
      }
      createdAt
    }
  }
`;

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($p_participantIds: [String!]!) {
    createConversation(p_createConversationInput: { participantIds: $p_participantIds }) {
      id
      participants {
        id
        userName
      }
      createdAt
    }
  }
`;

interface ConversationModalProps {
  open: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationCreated?: (conversation: any) => void;
}

const Modal: React.FC<ConversationModalProps> = ({
  open,
  onClose,
  currentUserId,
  onConversationCreated,
}) => {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createConversation, { loading: creating }] = useMutation(CREATE_CONVERSATION);
  const [findConversation] = useLazyQuery(FIND_CONVERSATION_BY_PARTICIPANTS);
  const [clickedUserIds, setClickedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      refetch(); // rafraîchit la liste quand la modale s'ouvre
    }
  }, [open, refetch]);

  const handleUserClick = async (userId: string) => {
  if (userId === currentUserId || clickedUserIds.includes(userId)) return;

  setClickedUserIds(prev => [...prev, userId]);    
  // Vérifie si la conversation existe déjà
    const participants = [currentUserId, userId];
    const { data } = await findConversation({ variables: { p_participantsIds: participants } });
    if (data?.findByParticipants) {
      alert("Une conversation existe déjà avec cet utilisateur.");
      onClose();
      return;
    }
    // Sinon, crée la conversation
    const res = await createConversation({
      variables: { p_participantIds: participants },
    });
    if (onConversationCreated) {
      onConversationCreated(res.data.createConversation);
    }
    onClose();
  };

  const getUserAvatar = (username: string) => {
    const firstLetter = username.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=${firstLetter}`;
  }

  if (!open) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          type='button'
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Start a Conversation</h2>
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-500">Error loading users</div>
        )  : !data || !data.users || data.users.length === 1 ? (
          <div>No users</div>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto">
            {
              data.users
              .filter((u: any) => u.id !== currentUserId)
              .map((user: any) => (
                <li
                  key={user.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition ${
                      clickedUserIds.includes(user.id)
                        ? 'bg-gray-100 cursor-not-allowed opacity-50'
                        : 'hover:bg-purple-50 cursor-pointer'
                    }`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <Avatar
                    src={getUserAvatar(user.userName)}
                    alt={user.userName}
                    size="md"
                  />
                  <span className="font-medium text-purple-600">{user.userName}</span>
                </li>
              ))}
          </ul>
        )}
        {creating && (
          <div className="mt-4 text-purple-600 text-sm">Creating conversation...</div>
        )}
      </div>
    </div>
  );
};

export default Modal;