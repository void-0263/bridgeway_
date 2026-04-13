import { useState, useEffect } from "react";
import { X, Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCountry } from "@/lib/CountryContext";
import { useI18n } from "@/lib/i18n";

interface DayWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  label: string;
}

const weatherIcon = (code: number) => {
  if (code <= 1) return <Sun className="w-6 h-6 text-warning" />;
  if (code <= 3) return <Cloud className="w-6 h-6 text-muted-foreground" />;
  if (code <= 48) return <Cloud className="w-6 h-6 text-muted-foreground" />;
  if (code <= 57) return <CloudDrizzle className="w-6 h-6 text-primary" />;
  if (code <= 67) return <CloudRain className="w-6 h-6 text-primary" />;
  if (code <= 77) return <CloudSnow className="w-6 h-6 text-blue-400" />;
  if (code <= 82) return <CloudRain className="w-6 h-6 text-primary" />;
  if (code <= 99) return <CloudLightning className="w-6 h-6 text-warning" />;
  return <Sun className="w-6 h-6 text-warning" />;
};

const weatherLabel = (code: number): string => {
  if (code <= 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunderstorm";
  return "Clear";
};

interface Props {
  onClose: () => void;
}

const WeatherForecast = ({ onClose }: Props) => {
  const { meta } = useCountry();
  const [days, setDays] = useState<DayWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const today = new Date();
        const past5 = new Date(today);
        past5.setDate(today.getDate() - 5);
        const future5 = new Date(today);
        future5.setDate(today.getDate() + 5);
        
        const startDate = past5.toISOString().split("T")[0];
        const endDate = future5.toISOString().split("T")[0];

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&start_date=${startDate}&end_date=${endDate}&timezone=${encodeURIComponent(meta.timezone)}`
        );
        const data = await res.json();
        
        if (data.daily) {
          const result: DayWeather[] = data.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            label: weatherLabel(data.daily.weather_code[i]),
          }));
          setDays(result);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-bold text-lg">{t("forecast")}</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          days.map((day) => {
            const isToday = day.date === todayStr;
            const dateObj = new Date(day.date + "T00:00:00");
            const dayName = isToday
              ? t("today")
              : dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dateLabel = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <div
                key={day.date}
                className={`glass-card rounded-xl p-4 flex items-center justify-between ${isToday ? "ring-2 ring-primary/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {weatherIcon(day.weatherCode)}
                  <div>
                    <p className={`text-sm font-semibold ${isToday ? "text-primary" : ""}`}>
                      {dayName}
                    </p>
                    <p className="text-xs text-muted-foreground">{dateLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{day.tempMax}° / {day.tempMin}°</p>
                  <p className="text-xs text-muted-foreground">{day.label}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;
