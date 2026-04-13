import { useState, useEffect } from "react";
import { Bus, TrainFront, Clock, Sun, Search, Globe, ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import VehicleTrackingMap from "./VehicleTrackingMap";
import WeatherForecast from "./WeatherForecast";
import { useI18n } from "@/lib/i18n";
import { useCountry, countryData, type Country } from "@/lib/CountryContext";
import { languages, type Lang } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { allTransit, countries, type TransitEntry } from "@/data/destinations";
import AnimatedPage from "./AnimatedPage";
import MotionCard from "./MotionCard";

const formatTime12h = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const HomeScreen = () => {
  const { t, lang, setLang } = useI18n();
  const { country, setCountry, countryLabel, meta } = useCountry();
  const [trackingKey, setTrackingKey] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentWeatherCode, setCurrentWeatherCode] = useState<number>(2);

  

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lon}&current=temperature_2m,weather_code&timezone=${encodeURIComponent(meta.timezone)}`
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
  }, [meta]);

  // Country-specific live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: meta.timezone });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: meta.timezone });

  const countryTransit = allTransit.filter((t) => t.country === country);
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
    <AnimatedPage>
      <div className="space-y-5 pb-24">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent/70 rounded-3xl p-6 text-primary-foreground shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 pr-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 opacity-80" />
                <span className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">Bridgeway</span>
              </div>
              <h1 className="text-2xl font-black leading-tight tracking-tight">{t("welcome")}</h1>
              <p className="text-sm opacity-85 mt-2 leading-snug font-medium">{t("welcomeSub")}</p>
            </div>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all backdrop-blur-sm border border-white/10"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang.slice(0, 3)}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {showLangMenu && (
            <div className="absolute right-4 top-[80px] z-[60] bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-2 min-w-[170px] max-h-[280px] overflow-y-auto">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                    lang === l ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted font-medium"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Country Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountry(c.id as Country)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm ${
                country === c.id
                  ? "bg-primary text-primary-foreground border-primary shadow-primary/25 shadow-lg"
                  : "bg-card/80 border-border/50 text-foreground hover:bg-muted hover:shadow-md backdrop-blur-sm"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchDest")}
            className="w-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground shadow-sm transition-all"
          />
        </div>

        {/* Time/Weather Widgets */}
        <div className="grid grid-cols-2 gap-3">
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <div>
                <MotionCard className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold">{timeStr}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{dateStr}</p>
                  </div>
                </MotionCard>
              </div>
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

          <MotionCard delay={0.05} className="p-4 flex items-center gap-3" onClick={() => setShowWeather(true)}>
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Sun className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-base font-extrabold">{currentTemp !== null ? `${currentTemp}°C` : "…"} {weatherDesc}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{t("forecast")} →</p>
            </div>
          </MotionCard>
        </div>

        {/* Bus Schedule */}
        {buses.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bus className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-extrabold text-sm">{t("busSchedule")}</h2>
              <span className="text-xs text-muted-foreground ml-auto font-medium">{buses.length} routes</span>
            </div>
            <div className="space-y-2.5">
              {buses.map((b, i) => (
                <MotionCard key={b.id} delay={i * 0.03} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-sm">{b.route}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{b.dest}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm">{formatTime12h(b.time)}</p>
                      <p className={`text-[11px] font-bold ${b.status === "on-time" ? "text-accent" : "text-warning"}`}>
                        {b.status === "on-time" ? t("onTime") : t("delayed")}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate font-medium">{b.stops.join(" → ")}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-xl font-bold" onClick={() => setTrackingKey(b.route)}>
                      {t("trackLive")}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs rounded-xl gap-1 font-bold" onClick={() => openInGoogleMaps(b)}>
                      <ExternalLink className="w-3 h-3" />
                      Maps
                    </Button>
                  </div>
                </MotionCard>
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
              <h2 className="font-extrabold text-sm">{t("mrtSchedule")}</h2>
              <span className="text-xs text-muted-foreground ml-auto font-medium">{trains.length} lines</span>
            </div>
            <div className="space-y-2.5">
              {trains.map((tr, i) => (
                <MotionCard key={tr.id} delay={i * 0.03} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-sm">{tr.route}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{tr.dest}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm">{formatTime12h(tr.time)}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{t("every")} {tr.frequency} {t("min")}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate font-medium">{tr.stops.join(" → ")}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-xl font-bold" onClick={() => setTrackingKey(tr.route)}>
                      {t("trackLive")}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs rounded-xl gap-1 font-bold" onClick={() => openInGoogleMaps(tr)}>
                      <ExternalLink className="w-3 h-3" />
                      Maps
                    </Button>
                  </div>
                </MotionCard>
              ))}
            </div>
          </section>
        )}

        {filteredTransit.length === 0 && search.trim() && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No routes found for "{search}"</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default HomeScreen;
