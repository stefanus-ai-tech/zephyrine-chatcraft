
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [activeMode, setActiveMode] = useState("chat");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />
      <ChatInterface />
    </div>
  );
};

export default Index;
