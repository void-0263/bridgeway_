import { Home, Languages, DollarSign, MapPin } from "lucide-react";

type Screen = "home" | "translator" | "currency" | "directory";

const tabs: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "translator", label: "Translate", icon: Languages },
  { id: "currency", label: "Currency", icon: DollarSign },
  { id: "directory", label: "Directory", icon: MapPin },
];

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const BottomNav = ({ active, onChange }: Props) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
    <div className="flex justify-around items-center h-[var(--nav-height)] max-w-lg mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
            <span className="text-[0.65rem] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
export type { Screen };
