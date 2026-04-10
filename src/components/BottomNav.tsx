import { Home, Languages, DollarSign, MapPin, Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Screen = "home" | "translator" | "currency" | "directory" | "messages";

const tabConfig: { id: Screen; labelKey: string; icon: typeof Home }[] = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "translator", labelKey: "translate", icon: Languages },
  { id: "currency", labelKey: "currency", icon: DollarSign },
  { id: "directory", labelKey: "directory", icon: MapPin },
  { id: "messages", labelKey: "messages", icon: Bell },
];

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const BottomNav = ({ active, onChange }: Props) => {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-[var(--nav-height)] max-w-lg mx-auto px-1 pb-[env(safe-area-inset-bottom)]">
        {tabConfig.map(({ id, labelKey, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className={`w-[18px] h-[18px] transition-transform ${isActive ? "scale-110" : ""}`} />
              </div>
              <span className="text-[0.6rem] font-medium leading-none">{t(labelKey as any)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
export type { Screen };
