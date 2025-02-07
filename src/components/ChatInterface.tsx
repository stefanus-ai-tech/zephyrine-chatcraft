
import { useState } from "react";
import { Send } from "lucide-react";

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

  const generateDummyResponse = () => {
    const randomIndex = Math.floor(Math.random() * dummyAiResponses.length);
    return dummyAiResponses[randomIndex];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: generateDummyResponse(),
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.isAi
                  ? "bg-secondary/50 text-foreground"
                  : "bg-primary/10 ml-auto"
              } max-w-[80%]`}
            >
              <p className="text-sm">{msg.content}</p>
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
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
