import { createContext, useContext, useState, type ReactNode } from "react";

export type Country = "singapore" | "india" | "dubai" | "america" | "japan" | "china";

interface CountryMeta {
  label: string;
  bg: string;
  timezone: string;
  lat: number;
  lon: number;
  currency: string;
}

interface CountryContextType {
  country: Country;
  setCountry: (c: Country) => void;
  countryLabel: string;
  bgImage: string;
  meta: CountryMeta;
}

const countryData: Record<Country, CountryMeta> = {
  singapore: {
    label: "🇸🇬 Singapore",
    bg: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80&auto=format",
    timezone: "Asia/Singapore",
    lat: 1.3521,
    lon: 103.8198,
    currency: "SGD",
  },
  india: {
    label: "🇮🇳 India",
    bg: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80&auto=format",
    timezone: "Asia/Kolkata",
    lat: 28.6139,
    lon: 77.209,
    currency: "INR",
  },
  dubai: {
    label: "🇦🇪 Dubai",
    bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80&auto=format",
    timezone: "Asia/Dubai",
    lat: 25.2048,
    lon: 55.2708,
    currency: "AED",
  },
  america: {
    label: "🇺🇸 America",
    bg: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=1920&q=80&auto=format",
    timezone: "America/New_York",
    lat: 40.7128,
    lon: -74.006,
    currency: "USD",
  },
  japan: {
    label: "🇯🇵 Japan",
    bg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80&auto=format",
    timezone: "Asia/Tokyo",
    lat: 35.6762,
    lon: 139.6503,
    currency: "JPY",
  },
  china: {
    label: "🇨🇳 China",
    bg: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80&auto=format",
    timezone: "Asia/Shanghai",
    lat: 39.9042,
    lon: 116.4074,
    currency: "CNY",
  },
};

const defaultMeta = countryData.singapore;

const CountryContext = createContext<CountryContextType>({
  country: "singapore",
  setCountry: () => {},
  countryLabel: "🇸🇬 Singapore",
  bgImage: defaultMeta.bg,
  meta: defaultMeta,
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

  const meta = countryData[country];

  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        countryLabel: meta.label,
        bgImage: meta.bg,
        meta,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export { countryData };
