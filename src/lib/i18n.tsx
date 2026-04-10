import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang } from "./translations";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations.English) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "English",
  setLang: () => {},
  t: (key) => translations.English[key],
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("community-hub-lang");
    return (saved as Lang) || "English";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("community-hub-lang", l);
  };

  const t = (key: keyof typeof translations.English) => {
    return translations[lang]?.[key] || translations.English[key];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
