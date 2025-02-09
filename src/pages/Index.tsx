
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import ChatHistoryNav from "@/components/ChatHistoryNav";

const Index = () => {
  const [activeMode, setActiveMode] = useState("chat");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />
      {activeMode === "history" ? <ChatHistoryNav /> : <ChatInterface />}
    </div>
  );
};

export default Index;
