import { useState, useEffect } from "react";
import { Bus, TrainFront, Clock, Sun, Search, Calendar, Globe, ChevronDown, ExternalLink } from "lucide-react";
import VehicleTrackingMap from "./VehicleTrackingMap";
import WeatherForecast from "./WeatherForecast";
import { useI18n } from "@/lib/i18n";
import { languages, type Lang } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface TransitEntry {
  id: string;
  route: string;
  dest: string;
  time: string;
  status: string;
  type: "bus" | "train";
  stops: string[];
  frequency?: string;
}

// Rich Singapore transit data
const allTransit: TransitEntry[] = [
  // Buses
  { id: "bus-170", route: "Bus 170", dest: "Johor Bahru ↔ Kranji MRT", time: "07:15", status: "on-time", type: "bus", stops: ["Johor Bahru CIQ", "Woodlands Checkpoint", "Woodlands Centre", "Marsiling MRT", "Kranji MRT"] },
  { id: "bus-858", route: "Bus 858", dest: "Yishun ↔ Woodlands", time: "07:30", status: "delayed", type: "bus", stops: ["Yishun Int", "Yishun Ring Rd", "Sembawang", "Admiralty", "Woodlands Int"] },
  { id: "bus-67", route: "Bus 67", dest: "Tampines ↔ Choa Chu Kang", time: "08:00", status: "on-time", type: "bus", stops: ["Tampines Int", "Bedok North", "Bishan", "Bukit Panjang", "Choa Chu Kang"] },
  { id: "bus-36", route: "Bus 36", dest: "Changi Airport ↔ Tomlinson Rd", time: "06:45", status: "on-time", type: "bus", stops: ["Changi Airport T3", "Tanah Merah", "Geylang", "Orchard", "Tomlinson Rd"] },
  { id: "bus-51", route: "Bus 51", dest: "Hougang ↔ Jurong East", time: "07:00", status: "on-time", type: "bus", stops: ["Hougang Central", "Serangoon", "Toa Payoh", "Bukit Timah", "Jurong East"] },
  { id: "bus-143", route: "Bus 143", dest: "Toa Payoh ↔ Punggol", time: "07:45", status: "delayed", type: "bus", stops: ["Toa Payoh Int", "Braddell", "Ang Mo Kio", "Sengkang", "Punggol"] },
  { id: "bus-12", route: "Bus 12", dest: "Pasir Ris ↔ Kampong Bahru", time: "08:15", status: "on-time", type: "bus", stops: ["Pasir Ris Int", "Tampines", "Bedok", "Katong", "Kampong Bahru"] },
  { id: "bus-190", route: "Bus 190", dest: "Choa Chu Kang ↔ Kampong Bahru", time: "06:30", status: "on-time", type: "bus", stops: ["Choa Chu Kang", "Bukit Batok", "Clementi", "Queenstown", "Kampong Bahru"] },
  // MRT
  { id: "nsl", route: "North-South Line", dest: "Jurong East ↔ Marina South Pier", time: "07:10", status: "on-time", type: "train", frequency: "4", stops: ["Jurong East", "Bukit Batok", "Bishan", "Orchard", "City Hall", "Marina Bay", "Marina South Pier"] },
  { id: "ewl", route: "East-West Line", dest: "Pasir Ris ↔ Tuas Link", time: "07:12", status: "on-time", type: "train", frequency: "5", stops: ["Pasir Ris", "Tampines", "Paya Lebar", "Bugis", "City Hall", "Jurong East", "Tuas Link"] },
  { id: "dtl", route: "Downtown Line", dest: "Bukit Panjang ↔ Expo", time: "07:08", status: "on-time", type: "train", frequency: "3", stops: ["Bukit Panjang", "Beauty World", "Botanic Gardens", "Downtown", "Bayfront", "Expo"] },
  { id: "ccl", route: "Circle Line", dest: "Dhoby Ghaut ↔ HarbourFront", time: "07:05", status: "on-time", type: "train", frequency: "4", stops: ["Dhoby Ghaut", "Bras Basah", "Paya Lebar", "MacPherson", "Bishan", "Botanic Gardens", "HarbourFront"] },
  { id: "nel", route: "North-East Line", dest: "HarbourFront ↔ Punggol", time: "07:06", status: "on-time", type: "train", frequency: "5", stops: ["HarbourFront", "Outram Park", "Dhoby Ghaut", "Little India", "Serangoon", "Sengkang", "Punggol"] },
  { id: "tel", route: "Thomson-East Coast Line", dest: "Woodlands North ↔ Bayshore", time: "07:15", status: "on-time", type: "train", frequency: "5", stops: ["Woodlands North", "Woodlands", "Caldecott", "Stevens", "Orchard", "Marina Bay", "Bayshore"] },
];

// Generate schedule times for a given base time
const generateTimes = (baseTime: string, count: number): string[] => {
  const [h, m] = baseTime.split(":").map(Number);
  const times: string[] = [];
  for (let i = 0; i < count; i++) {
    const newM = m + i * 15;
    const totalMinutes = h * 60 + newM;
    const hh = Math.floor(totalMinutes / 60) % 24;
    const mm = totalMinutes % 60;
    times.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return times;
};

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

  // Fetch current weather
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

  // Filter transit by search
  const searchLower = search.toLowerCase();
  const filteredTransit = search.trim()
    ? allTransit.filter(
        (t) =>
          t.route.toLowerCase().includes(searchLower) ||
          t.dest.toLowerCase().includes(searchLower) ||
          t.stops.some((s) => s.toLowerCase().includes(searchLower))
      )
    : allTransit;

  const buses = filteredTransit.filter((t) => t.type === "bus");
  const trains = filteredTransit.filter((t) => t.type === "train");

  const openInGoogleMaps = (entry: TransitEntry) => {
    const origin = entry.stops[0];
    const destination = entry.stops[entry.stops.length - 1];
    const mode = entry.type === "bus" ? "transit" : "transit";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin + ", Singapore")}&destination=${encodeURIComponent(destination + ", Singapore")}&travelmode=${mode}`;
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
    <div className="space-y-5">
      {/* Header with language selector */}
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
          <div className="absolute right-4 top-16 z-30 bg-card text-card-foreground rounded-xl shadow-lg border border-border p-2 min-w-[160px]">
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

      {/* Time/Weather widgets */}
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

        <button
          onClick={() => setShowWeather(true)}
          className="glass-card rounded-xl p-4 flex items-center gap-3 text-left"
        >
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
                <p className="text-[10px] text-muted-foreground truncate">
                  {b.stops.join(" → ")}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs rounded-lg"
                    onClick={() => setTrackingKey(b.route)}
                  >
                    {t("trackLive")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs rounded-lg gap-1"
                    onClick={() => openInGoogleMaps(b)}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Maps
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MRT Schedule */}
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
                <p className="text-[10px] text-muted-foreground truncate">
                  {tr.stops.join(" → ")}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs rounded-lg"
                    onClick={() => setTrackingKey(tr.route)}
                  >
                    {t("trackLive")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs rounded-lg gap-1"
                    onClick={() => openInGoogleMaps(tr)}
                  >
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
