import { Home, Languages, DollarSign, BookOpen, MessageSquare, Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export type Screen = "home" | "translator" | "currency" | "forum" | "guide" | "messages";

const tabConfig: { id: Screen; labelKey: string; icon: typeof Home }[] = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "forum", labelKey: "forum", icon: MessageSquare },
  { id: "guide", labelKey: "guide", icon: BookOpen },
  { id: "translator", labelKey: "translate", icon: Languages },
  { id: "messages", labelKey: "messages", icon: Bell },
];

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const BottomNav = ({ active, onChange }: Props) => {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-2xl border-t border-border/50">
      <div className="flex justify-around items-center h-[var(--nav-height)] max-w-lg mx-auto px-1 pb-[env(safe-area-inset-bottom)]">
        {tabConfig.map(({ id, labelKey, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-col items-center gap-0.5 flex-1 py-1 transition-all"
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-[18px] h-[18px] relative z-10 transition-all ${
                    isActive ? "text-primary scale-110" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-[0.6rem] font-medium leading-none transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(labelKey as any)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
