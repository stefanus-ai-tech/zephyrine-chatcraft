export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const saveSession = (session: ChatSession) => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === session.id);

  if (sessionIndex >= 0) {
    sessions[sessionIndex] = session;
  } else {
    sessions.push(session);
  }

  localStorage.setItem("chatSessions", JSON.stringify(sessions));
};

export const getSessions = (): ChatSession[] => {
  const sessions = localStorage.getItem("chatSessions");
  return sessions ? JSON.parse(sessions) : [];
};

export const deleteSession = (sessionId: string) => {
  const sessions = getSessions().filter((s) => s.id !== sessionId);
  localStorage.setItem("chatSessions", JSON.stringify(sessions));
};

export const getSession = (sessionId: string): ChatSession | undefined => {
  return getSessions().find((s) => s.id === sessionId);
};
