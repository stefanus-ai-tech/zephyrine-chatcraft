import React, { useState, useEffect } from 'react';
import { getChatHistory } from '@/lib/storage';
import ChatHistoryItem from './ChatHistoryItem';

const ChatHistoryNav = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = getChatHistory();
    setHistory(storedHistory);
  }, []);

  return (
    <div>
      <h2>Chat History</h2>
      {history.map((chat, index) => (
        <ChatHistoryItem key={index} title={`Chat ${index + 1}`} onClick={() => console.log(`Clicked chat ${index + 1}`)} />
      ))}
    </div>
  );
};

export default ChatHistoryNav;
