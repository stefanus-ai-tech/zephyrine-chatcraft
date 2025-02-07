
import { useState } from "react";
import { Send } from "lucide-react";

export const ChatInterface = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Messages will be rendered here */}
        <div className="flex flex-col gap-4">
          <div className="bg-secondary/50 p-4 rounded-lg max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Welcome to Zephyrine</h1>
            <p className="text-lg mb-2">I'm here to help! You can:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Chat with me naturally</li>
              <li>Share images for analysis</li>
              <li>Use voice commands</li>
              <li>Start a video conversation</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
