import { Bus, TrainFront, Clock, Cloud, Sun, CloudRain } from "lucide-react";

const busSchedule = [
  { route: "Bus 170", dest: "Johor Bahru → Kranji MRT", time: "07:15 AM", status: "On Time" },
  { route: "Bus 858", dest: "Yishun → Woodlands", time: "07:30 AM", status: "Delayed 5m" },
  { route: "Bus 67", dest: "Tampines → Choa Chu Kang", time: "08:00 AM", status: "On Time" },
];

const trainSchedule = [
  { line: "North-South Line", dest: "Jurong East → Marina Bay", time: "07:10 AM", freq: "Every 4 min" },
  { line: "East-West Line", dest: "Pasir Ris → Tuas Link", time: "07:12 AM", freq: "Every 5 min" },
  { line: "Downtown Line", dest: "Bukit Panjang → Expo", time: "07:08 AM", freq: "Every 3 min" },
];

const HomeScreen = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
        <h1 className="text-xl font-bold">Welcome to Community Hub 👋</h1>
        <p className="text-sm opacity-90 mt-1">Your guide to navigating daily life abroad.</p>
      </div>

      {/* Time & Weather */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-lg font-bold">{timeStr}</p>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <Sun className="w-8 h-8 text-warning shrink-0" />
          <div>
            <p className="text-lg font-bold">31°C</p>
            <p className="text-xs text-muted-foreground">Partly Cloudy</p>
          </div>
        </div>
      </div>

      {/* Bus Schedule */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Bus className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-base">Bus Schedule</h2>
        </div>
        <div className="space-y-2">
          {busSchedule.map((b, i) => (
            <div key={i} className="glass-card rounded-xl p-3.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{b.route}</p>
                <p className="text-xs text-muted-foreground">{b.dest}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{b.time}</p>
                <p className={`text-xs font-medium ${b.status === "On Time" ? "text-success" : "text-warning"}`}>
                  {b.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Train Schedule */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrainFront className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-base">MRT Schedule</h2>
        </div>
        <div className="space-y-2">
          {trainSchedule.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-3.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{t.line}</p>
                <p className="text-xs text-muted-foreground">{t.dest}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{t.time}</p>
                <p className="text-xs text-muted-foreground">{t.freq}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
