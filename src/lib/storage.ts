export const saveChatHistory = (history: any[]) => {
  localStorage.setItem('chatHistory', JSON.stringify(history));
};

export const getChatHistory = () => {
  const history = localStorage.getItem('chatHistory');
  return history ? JSON.parse(history) : [];
};
