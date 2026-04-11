import { createContext, useContext, useState, type ReactNode } from "react";

export type Country = "singapore" | "india" | "dubai" | "america" | "japan" | "china";

interface CountryContextType {
  country: Country;
  setCountry: (c: Country) => void;
  countryLabel: string;
  bgImage: string;
}

const countryData: Record<Country, { label: string; bg: string }> = {
  singapore: {
    label: "🇸🇬 Singapore",
    bg: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80&auto=format",
  },
  india: {
    label: "🇮🇳 India",
    bg: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80&auto=format",
  },
  dubai: {
    label: "🇦🇪 Dubai",
    bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80&auto=format",
  },
  america: {
    label: "🇺🇸 America",
    bg: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=1920&q=80&auto=format",
  },
  japan: {
    label: "🇯🇵 Japan",
    bg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80&auto=format",
  },
  china: {
    label: "🇨🇳 China",
    bg: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80&auto=format",
  },
};

const CountryContext = createContext<CountryContextType>({
  country: "singapore",
  setCountry: () => {},
  countryLabel: "🇸🇬 Singapore",
  bgImage: countryData.singapore.bg,
});

export const useCountry = () => useContext(CountryContext);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem("community-hub-country") as Country;
    return saved && countryData[saved] ? saved : "singapore";
  });

  const setCountry = (c: Country) => {
    setCountryState(c);
    localStorage.setItem("community-hub-country", c);
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        countryLabel: countryData[country].label,
        bgImage: countryData[country].bg,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export { countryData };
