import { useState, useEffect } from "react";
import { Bus, TrainFront, Clock, Sun, Search, Globe, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import VehicleTrackingMap from "./VehicleTrackingMap";
import WeatherForecast from "./WeatherForecast";
import { useI18n } from "@/lib/i18n";
import { languages, type Lang } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { allTransit, countries, type TransitEntry } from "@/data/destinations";

const formatTime12h = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const HomeScreen = () => {
  const { t, lang, setLang } = useI18n();
  const [trackingKey, setTrackingKey] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentWeatherCode, setCurrentWeatherCode] = useState<number>(2);
  const [selectedCountry, setSelectedCountry] = useState("singapore");

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=1.3521&longitude=103.8198&current=temperature_2m,weather_code&timezone=Asia/Singapore"
        );
        const data = await res.json();
        if (data.current) {
          setCurrentTemp(Math.round(data.current.temperature_2m));
          setCurrentWeatherCode(data.current.weather_code);
        }
      } catch (err) {
        console.error("Weather error:", err);
      }
    };
    fetchCurrentWeather();
  }, []);

  const timeStr = selectedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  // Filter by country first, then by search
  const countryTransit = allTransit.filter((t) => t.country === selectedCountry);
  const searchLower = search.toLowerCase();
  const filteredTransit = search.trim()
    ? countryTransit.filter(
        (t) =>
          t.route.toLowerCase().includes(searchLower) ||
          t.dest.toLowerCase().includes(searchLower) ||
          t.stops.some((s) => s.toLowerCase().includes(searchLower))
      )
    : countryTransit;

  const buses = filteredTransit.filter((t) => t.type === "bus");
  const trains = filteredTransit.filter((t) => t.type === "train");

  const openInGoogleMaps = (entry: TransitEntry) => {
    const origin = entry.stops[0];
    const destination = entry.stops[entry.stops.length - 1];
    const suffix = entry.mapCountry;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin + ", " + suffix)}&destination=${encodeURIComponent(destination + ", " + suffix)}&travelmode=transit`;
    window.open(url, "_blank");
  };

  if (trackingKey) {
    return <VehicleTrackingMap vehicleKey={trackingKey} onClose={() => setTrackingKey(null)} />;
  }

  if (showWeather) {
    return <WeatherForecast onClose={() => setShowWeather(false)} />;
  }

  const weatherDesc = currentWeatherCode <= 1 ? "☀️" : currentWeatherCode <= 3 ? "⛅" : "🌧️";

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{t("welcome")}</h1>
            <p className="text-sm opacity-90 mt-1">{t("welcomeSub")}</p>
          </div>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 bg-primary-foreground/20 rounded-lg px-2.5 py-1.5 text-xs font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang.slice(0, 3)}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        {showLangMenu && (
          <div className="absolute right-4 top-16 z-30 bg-card text-card-foreground rounded-xl shadow-lg border border-border p-2 min-w-[160px] max-h-[300px] overflow-y-auto">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setShowLangMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {countries.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              selectedCountry === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchDest")}
          className="w-full rounded-xl bg-card border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Time/Weather */}
      <div className="grid grid-cols-2 gap-3">
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <button className="glass-card rounded-xl p-4 flex items-center gap-3 text-left w-full">
              <Clock className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="text-lg font-bold">{timeStr}</p>
                <p className="text-xs text-muted-foreground">{dateStr}</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(d) => { if (d) { setSelectedDate(d); setShowDatePicker(false); } }}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <button onClick={() => setShowWeather(true)} className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
          <Sun className="w-8 h-8 text-warning shrink-0" />
          <div>
            <p className="text-lg font-bold">{currentTemp !== null ? `${currentTemp}°C` : "..."} {weatherDesc}</p>
            <p className="text-xs text-muted-foreground">{t("forecast")} →</p>
          </div>
        </button>
      </div>

      {/* Bus Schedule */}
      {buses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bus className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base">{t("busSchedule")}</h2>
          </div>
          <div className="space-y-2">
            {buses.map((b) => (
              <div key={b.id} className="glass-card rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{b.route}</p>
                    <p className="text-xs text-muted-foreground">{b.dest}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatTime12h(b.time)}</p>
                    <p className={`text-xs font-medium ${b.status === "on-time" ? "text-success" : "text-warning"}`}>
                      {b.status === "on-time" ? t("onTime") : t("delayed")}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{b.stops.join(" → ")}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg" onClick={() => setTrackingKey(b.route)}>
                    {t("trackLive")}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs rounded-lg gap-1" onClick={() => openInGoogleMaps(b)}>
                    <ExternalLink className="w-3 h-3" />
                    Maps
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Train/Metro Schedule */}
      {trains.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrainFront className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base">{t("mrtSchedule")}</h2>
          </div>
          <div className="space-y-2">
            {trains.map((tr) => (
              <div key={tr.id} className="glass-card rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{tr.route}</p>
                    <p className="text-xs text-muted-foreground">{tr.dest}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatTime12h(tr.time)}</p>
                    <p className="text-xs text-muted-foreground">{t("every")} {tr.frequency} {t("min")}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{tr.stops.join(" → ")}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg" onClick={() => setTrackingKey(tr.route)}>
                    {t("trackLive")}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs rounded-lg gap-1" onClick={() => openInGoogleMaps(tr)}>
                    <ExternalLink className="w-3 h-3" />
                    Maps
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredTransit.length === 0 && search.trim() && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No routes found for "{search}"
        </p>
      )}
    </div>
  );
};

export default HomeScreen;
