import { useState, useEffect } from "react";
import { Send, Copy, Edit } from "lucide-react";
import { EditMessageDialog } from "@/components/ui/edit-message-dialog";
import Groq from "groq-sdk";
import { saveChatHistory, getChatHistory } from "@/lib/storage";

// NOTE: Setting `dangerouslyAllowBrowser` to `true` exposes your API key to the client-side.
// In a production environment, you should handle API calls through a server-side proxy
// to avoid exposing your credentials.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [messageBeingEdited, setMessageBeingEdited] = useState<Message | null>(
    null
  );
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const storedHistory = getChatHistory();
    if (storedHistory) {
      setMessages(storedHistory);
    }
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    setMessageBeingEdited(null);
  };

  const handleMessageSave = async (editedContent: string) => {
    if (!messageBeingEdited) return;

    const editedMessageIndex = messages.findIndex(
      (msg) => msg.id === messageBeingEdited.id
    );
    if (editedMessageIndex === -1) return;

    const updatedMessages = [...messages];

    const editedMessage = {
      ...messages[editedMessageIndex],
      content: editedContent,
      timestamp: new Date(),
    };
    updatedMessages[editedMessageIndex] = editedMessage;

    setMessages(updatedMessages);
    setMessage("");

    // Add AI message placeholder
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: "",
      isAi: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          ...messages.map((msg) => ({
            role: msg.isAi ? ("assistant" as const) : ("user" as const),
            content: msg.content,
          })),
          {
            role: "user" as const,
            content: editedContent,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      for await (const chunk of chatCompletion) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const aiMessageIndex = updatedMessages.findIndex(
            (msg) => msg.id === aiMessage.id
          );

          if (aiMessageIndex !== -1) {
            updatedMessages[aiMessageIndex] = {
              ...updatedMessages[aiMessageIndex],
              content:
                updatedMessages[aiMessageIndex].content +
                (chunk.choices[0]?.delta?.content || ""),
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching from Groq:", error);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const aiMessageIndex = updatedMessages.findIndex(
          (msg) => msg.id === aiMessage.id
        );

        if (aiMessageIndex !== -1) {
          updatedMessages[aiMessageIndex] = {
            ...updatedMessages[aiMessageIndex],
            content: "An error occurred while fetching the response.",
          };
        }
        return updatedMessages;
      });
    }

    handleDialogClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (editingMessageId) {
      setEditingMessageId(null);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Add AI message placeholder
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: "",
      isAi: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          ...messages.map((msg) => ({
            role: msg.isAi ? ("assistant" as const) : ("user" as const),
            content: msg.content,
          })),
          {
            role: "user" as const,
            content: message,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      for await (const chunk of chatCompletion) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const aiMessageIndex = updatedMessages.findIndex(
            (msg) => msg.id === aiMessage.id
          );

          if (aiMessageIndex !== -1) {
            updatedMessages[aiMessageIndex] = {
              ...updatedMessages[aiMessageIndex],
              content:
                updatedMessages[aiMessageIndex].content +
                (chunk.choices[0]?.delta?.content || ""),
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching from Groq:", error);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const aiMessageIndex = updatedMessages.findIndex(
          (msg) => msg.id === aiMessage.id
        );

        if (aiMessageIndex !== -1) {
          updatedMessages[aiMessageIndex] = {
            ...updatedMessages[aiMessageIndex],
            content: "An error occurred while fetching the response.",
          };
        }
        return updatedMessages;
      });
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleEdit = (message: Message) => {
    setMessageBeingEdited(message);
    setIsEditDialogOpen(true);
    console.log("handleEdit called", isEditDialogOpen);
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
                    onClick={() => handleEdit(msg)}
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
            placeholder={
              editingMessageId ? "Edit your message..." : "Type your message..."
            }
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

      <EditMessageDialog
        isOpen={isEditDialogOpen}
        onClose={handleDialogClose}
        messageContent={messageBeingEdited?.content || ""}
        onSave={handleMessageSave}
      />
    </div>
  );
};
