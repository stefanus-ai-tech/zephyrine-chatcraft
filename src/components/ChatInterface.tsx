
import { useState } from "react";
import { Send, Copy, Edit } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

const dummyAiResponses = [
  "I understand what you're saying. Could you tell me more about that?",
  "That's an interesting perspective. Let me analyze that for you.",
  "I can help you with that. Here's what I think...",
  "Based on my analysis, I would suggest considering these points...",
  "Let me process that information and provide you with a detailed response.",
];

export const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm Zephyrine, your AI assistant. How can I help you today?",
      isAi: true,
      timestamp: new Date(),
    },
  ]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const generateDummyResponse = () => {
    const randomIndex = Math.floor(Math.random() * dummyAiResponses.length);
    return dummyAiResponses[randomIndex];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (editingMessageId) {
      // Find the index of the message being edited
      const editedMessageIndex = messages.findIndex(msg => msg.id === editingMessageId);
      if (editedMessageIndex === -1) return;

      // Create a new array with messages up to the edited message
      const updatedMessages = messages.slice(0, editedMessageIndex);
      
      // Add the edited message
      const editedMessage = {
        ...messages[editedMessageIndex],
        content: message,
        timestamp: new Date()
      };
      updatedMessages.push(editedMessage);

      setMessages(updatedMessages);
      setEditingMessageId(null);

      // Generate new AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: generateDummyResponse(),
          isAi: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    } else {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: message,
        isAi: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Generate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: generateDummyResponse(),
          isAi: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
    
    setMessage("");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setMessage(content);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative p-4 rounded-lg group ${
                msg.isAi
                  ? "bg-secondary/50 text-foreground"
                  : "bg-primary/10 ml-auto"
              } max-w-[80%] animate-fade-in`}
            >
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="p-1 rounded-md hover:bg-background/80 transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {!msg.isAi && (
                  <button
                    onClick={() => handleEdit(msg.id, msg.content)}
                    className="p-1 rounded-md hover:bg-background/80 transition-colors"
                    title="Edit message"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm pr-14">{msg.content}</p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
            className="flex-1 p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button 
            type="submit"
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
