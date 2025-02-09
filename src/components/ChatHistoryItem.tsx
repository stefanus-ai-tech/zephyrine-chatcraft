import React from 'react';

interface ChatHistoryItemProps {
  title: string;
  onClick: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
};

export default ChatHistoryItem;
