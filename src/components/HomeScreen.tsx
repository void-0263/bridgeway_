import { useState, useEffect } from "react";
import { Bus, TrainFront, Clock, Sun, Search, Globe, ChevronDown, ExternalLink, Sparkles } from "lucide-react";
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
  const dateStr = selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

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
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin + ", " + entry.mapCountry)}&destination=${encodeURIComponent(destination + ", " + entry.mapCountry)}&travelmode=transit`;
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
    <div className="space-y-5 pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-accent/80 rounded-2xl p-5 text-primary-foreground overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 opacity-80" />
              <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Community Hub</span>
            </div>
            <h1 className="text-xl font-extrabold leading-tight">{t("welcome")}</h1>
            <p className="text-sm opacity-85 mt-1.5 leading-snug">{t("welcomeSub")}</p>
          </div>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2 text-xs font-semibold transition-colors backdrop-blur-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang.slice(0, 3)}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {showLangMenu && (
          <div className="absolute right-4 top-[72px] z-30 bg-card text-card-foreground rounded-xl shadow-xl border border-border p-1.5 min-w-[160px] max-h-[280px] overflow-y-auto">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setShowLangMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {countries.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              selectedCountry === c.id
                ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                : "bg-card border-border text-foreground hover:bg-muted hover:shadow-md"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchDest")}
          className="w-full rounded-xl bg-card border border-border pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground shadow-sm transition-all"
        />
      </div>

      {/* Time/Weather Widgets */}
      <div className="grid grid-cols-2 gap-3">
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <button className="group glass-card rounded-xl p-4 flex items-center gap-3 text-left w-full hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-bold">{timeStr}</p>
                <p className="text-[11px] text-muted-foreground">{dateStr}</p>
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

        <button onClick={() => setShowWeather(true)} className="group glass-card rounded-xl p-4 flex items-center gap-3 text-left hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/15 transition-colors">
            <Sun className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-base font-bold">{currentTemp !== null ? `${currentTemp}°C` : "…"} {weatherDesc}</p>
            <p className="text-[11px] text-muted-foreground">{t("forecast")} →</p>
          </div>
        </button>
      </div>

      {/* Bus Schedule */}
      {buses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold text-sm">{t("busSchedule")}</h2>
            <span className="text-xs text-muted-foreground ml-auto">{buses.length} routes</span>
          </div>
          <div className="space-y-2.5">
            {buses.map((b) => (
              <div key={b.id} className="glass-card rounded-xl p-3.5 space-y-2.5 hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{b.route}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.dest}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatTime12h(b.time)}</p>
                    <p className={`text-[11px] font-semibold ${b.status === "on-time" ? "text-accent" : "text-warning"}`}>
                      {b.status === "on-time" ? t("onTime") : t("delayed")}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{b.stops.join(" → ")}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg font-semibold" onClick={() => setTrackingKey(b.route)}>
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

      {/* Train Schedule */}
      {trains.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrainFront className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-bold text-sm">{t("mrtSchedule")}</h2>
            <span className="text-xs text-muted-foreground ml-auto">{trains.length} lines</span>
          </div>
          <div className="space-y-2.5">
            {trains.map((tr) => (
              <div key={tr.id} className="glass-card rounded-xl p-3.5 space-y-2.5 hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{tr.route}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tr.dest}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatTime12h(tr.time)}</p>
                    <p className="text-[11px] text-muted-foreground">{t("every")} {tr.frequency} {t("min")}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{tr.stops.join(" → ")}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg font-semibold" onClick={() => setTrackingKey(tr.route)}>
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
        <div className="text-center py-12">
          <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No routes found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
