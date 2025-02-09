import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getSessions, deleteSession, ChatSession } from "@/lib/storage";

interface ChatHistoryNavProps {
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
}

export const ChatHistoryNav: React.FC<ChatHistoryNavProps> = ({
  currentSessionId,
  onSessionSelect,
  onNewSession,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(sessionId);
    setSessions(getSessions());
  };

  return (
    <div className="w-64 bg-secondary/50 h-screen p-4 flex flex-col gap-2">
      <button
        onClick={onNewSession}
        className="w-full flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-primary/10"
      >
        <Plus size={16} />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSessionSelect(session.id)}
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${
              currentSessionId === session.id
                ? "bg-primary/10"
                : "hover:bg-primary/5"
            }`}
          >
            <div className="truncate flex-1">
              <span className="text-sm">{session.title || "New Chat"}</span>
              <span className="text-xs text-muted-foreground block">
                {new Date(session.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={(e) => handleDeleteSession(session.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryNav;
