import { useState } from "react";
import BottomNav, { type Screen } from "@/components/BottomNav";
import HomeScreen from "@/components/HomeScreen";
import TranslatorScreen from "@/components/TranslatorScreen";
import CurrencyScreen from "@/components/CurrencyScreen";
import DirectoryScreen from "@/components/DirectoryScreen";

const screens: Record<Screen, React.FC> = {
  home: HomeScreen,
  translator: TranslatorScreen,
  currency: CurrencyScreen,
  directory: DirectoryScreen,
};

const Index = () => {
  const [active, setActive] = useState<Screen>("home");
  const ActiveScreen = screens[active];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pt-4 safe-bottom">
        <ActiveScreen />
      </main>
      <BottomNav active={active} onChange={setActive} />
    </div>
  );
};

export default Index;
