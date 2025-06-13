import React from 'react';
import { useQuery, useMutation, gql, useLazyQuery } from '@apollo/client';
import Avatar from '../ui/Avatar';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=U';

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
  const { data, loading, error } = useQuery(GET_USERS);
  const [createConversation, { loading: creating }] = useMutation(CREATE_CONVERSATION);
  const [findConversation] = useLazyQuery(FIND_CONVERSATION_BY_PARTICIPANTS);


  if (!open) return null;

  const handleUserClick = async (userId: string) => {
    if (userId === currentUserId) return;
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
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto">
            {
              data.users
              .filter((u: any) => u.id !== currentUserId)
              .map((user: any) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition"
                  onClick={() => handleUserClick(user.id)}
                >
                  <Avatar
                    src={user.avatar || DEFAULT_AVATAR}
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