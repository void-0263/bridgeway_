import { useState } from "react";
import BottomNav, { type Screen } from "@/components/BottomNav";
import HomeScreen from "@/components/HomeScreen";
import TranslatorScreen from "@/components/TranslatorScreen";
import CurrencyScreen from "@/components/CurrencyScreen";
import ForumScreen from "@/components/ForumScreen";
import LocalGuideScreen from "@/components/LocalGuideScreen";
import MessagesScreen from "@/components/MessagesScreen";
import DynamicBackground from "@/components/DynamicBackground";
import { I18nProvider } from "@/lib/i18n";
import { CountryProvider } from "@/lib/CountryContext";
import { AnimatePresence, motion } from "framer-motion";

const screens: Record<Screen, React.FC> = {
  home: HomeScreen,
  translator: TranslatorScreen,
  currency: CurrencyScreen,
  forum: ForumScreen,
  guide: LocalGuideScreen,
  messages: MessagesScreen,
};

const Index = () => {
  const [active, setActive] = useState<Screen>("home");
  const ActiveScreen = screens[active];

  return (
    <I18nProvider>
      <CountryProvider>
        <DynamicBackground>
          <main className="max-w-lg mx-auto px-4 pt-4 safe-bottom">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveScreen />
              </motion.div>
            </AnimatePresence>
          </main>
          <BottomNav active={active} onChange={setActive} />
        </DynamicBackground>
      </CountryProvider>
    </I18nProvider>
  );
};

export default Index;
