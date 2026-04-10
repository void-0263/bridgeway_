import { Home, Languages, DollarSign, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Screen = "home" | "translator" | "currency" | "directory";

const tabConfig: { id: Screen; labelKey: "home" | "translate" | "currency" | "directory"; icon: typeof Home }[] = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "translator", labelKey: "translate", icon: Languages },
  { id: "currency", labelKey: "currency", icon: DollarSign },
  { id: "directory", labelKey: "directory", icon: MapPin },
];

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const BottomNav = ({ active, onChange }: Props) => {
  const { t } = useI18n();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-[var(--nav-height)] max-w-lg mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {tabConfig.map(({ id, labelKey, icon: Icon }) => {
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
              <span className="text-[0.65rem] font-medium">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
export type { Screen };
