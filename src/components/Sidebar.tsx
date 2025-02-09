
import { MessageSquare, Image, Mic, Video, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof MessageSquare | typeof List;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavButton = ({ icon: Icon, label, active, onClick }: NavItem) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full p-3 flex flex-col items-center gap-2 rounded-lg transition-all duration-200",
      "hover:bg-primary/10",
      active && "bg-primary/20"
    )}
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

export const Sidebar = ({ activeMode, onModeChange }: SidebarProps) => {
  const modes = [
    { icon: List, label: "History", id: "history" },
    { icon: MessageSquare, label: "Chat", id: "chat" },
    { icon: Image, label: "Image", id: "image" },
    { icon: Mic, label: "Voice", id: "voice" },
    { icon: Video, label: "Video", id: "video" },
  ];

  return (
    <div className="w-20 h-screen bg-secondary border-r border-border flex flex-col items-center py-4 gap-2">
      <div className="w-12 h-12 rounded-full bg-primary mb-6 animate-fade-in" />
      {modes.map((mode) => (
        <NavButton
          key={mode.id}
          icon={mode.icon}
          label={mode.label}
          active={activeMode === mode.id}
          onClick={() => onModeChange(mode.id)}
        />
      ))}
    </div>
  );
};
