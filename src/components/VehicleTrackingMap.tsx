import { useState, useEffect, useRef } from "react";
import { X, Bus, TrainFront, MapPin, Navigation } from "lucide-react";

interface Stop {
  name: string;
  x: number;
  y: number;
}

interface VehicleInfo {
  type: "bus" | "train";
  name: string;
  dest: string;
  stops: Stop[];
  color: string;
}

const routeData: Record<string, VehicleInfo> = {
  "Bus 170": {
    type: "bus",
    name: "Bus 170",
    dest: "Johor Bahru → Kranji MRT",
    color: "hsl(var(--primary))",
    stops: [
      { name: "Johor Bahru CIQ", x: 50, y: 350 },
      { name: "Woodlands Checkpoint", x: 120, y: 280 },
      { name: "Woodlands Centre", x: 180, y: 220 },
      { name: "Marsiling MRT", x: 250, y: 170 },
      { name: "Kranji MRT", x: 340, y: 120 },
    ],
  },
  "Bus 858": {
    type: "bus",
    name: "Bus 858",
    dest: "Yishun → Woodlands",
    color: "hsl(var(--warning))",
    stops: [
      { name: "Yishun Int", x: 330, y: 350 },
      { name: "Yishun Ring Rd", x: 280, y: 290 },
      { name: "Sembawang", x: 220, y: 230 },
      { name: "Admiralty", x: 160, y: 170 },
      { name: "Woodlands Int", x: 90, y: 110 },
    ],
  },
  "Bus 67": {
    type: "bus",
    name: "Bus 67",
    dest: "Tampines → Choa Chu Kang",
    color: "hsl(var(--success))",
    stops: [
      { name: "Tampines Int", x: 340, y: 340 },
      { name: "Bedok North", x: 290, y: 280 },
      { name: "Bishan", x: 210, y: 210 },
      { name: "Bukit Panjang", x: 130, y: 150 },
      { name: "Choa Chu Kang", x: 60, y: 100 },
    ],
  },
  "North-South Line": {
    type: "train",
    name: "North-South Line",
    dest: "Jurong East → Marina Bay",
    color: "#e4002b",
    stops: [
      { name: "Jurong East", x: 50, y: 200 },
      { name: "Bukit Batok", x: 100, y: 240 },
      { name: "Bishan", x: 170, y: 200 },
      { name: "Orchard", x: 240, y: 260 },
      { name: "City Hall", x: 300, y: 300 },
      { name: "Marina Bay", x: 350, y: 350 },
    ],
  },
  "East-West Line": {
    type: "train",
    name: "East-West Line",
    dest: "Pasir Ris → Tuas Link",
    color: "#009645",
    stops: [
      { name: "Pasir Ris", x: 350, y: 120 },
      { name: "Tampines", x: 300, y: 160 },
      { name: "Paya Lebar", x: 240, y: 200 },
      { name: "Bugis", x: 180, y: 240 },
      { name: "Jurong East", x: 110, y: 290 },
      { name: "Tuas Link", x: 50, y: 340 },
    ],
  },
  "Downtown Line": {
    type: "train",
    name: "Downtown Line",
    dest: "Bukit Panjang → Expo",
    color: "#005da2",
    stops: [
      { name: "Bukit Panjang", x: 60, y: 100 },
      { name: "Beauty World", x: 120, y: 150 },
      { name: "Botanic Gardens", x: 180, y: 200 },
      { name: "Downtown", x: 250, y: 270 },
      { name: "Bayfront", x: 300, y: 310 },
      { name: "Expo", x: 350, y: 350 },
    ],
  },
  "Bus 36": {
    type: "bus",
    name: "Bus 36",
    dest: "Changi Airport → Tomlinson Rd",
    color: "hsl(var(--primary))",
    stops: [
      { name: "Changi Airport T3", x: 350, y: 100 },
      { name: "Tanah Merah", x: 300, y: 170 },
      { name: "Geylang", x: 230, y: 230 },
      { name: "Orchard", x: 150, y: 290 },
      { name: "Tomlinson Rd", x: 80, y: 350 },
    ],
  },
  "Bus 51": {
    type: "bus",
    name: "Bus 51",
    dest: "Hougang → Jurong East",
    color: "hsl(var(--warning))",
    stops: [
      { name: "Hougang Central", x: 340, y: 120 },
      { name: "Serangoon", x: 280, y: 180 },
      { name: "Toa Payoh", x: 210, y: 230 },
      { name: "Bukit Timah", x: 130, y: 280 },
      { name: "Jurong East", x: 60, y: 340 },
    ],
  },
  "Bus 143": {
    type: "bus",
    name: "Bus 143",
    dest: "Toa Payoh → Punggol",
    color: "hsl(var(--success))",
    stops: [
      { name: "Toa Payoh Int", x: 70, y: 340 },
      { name: "Braddell", x: 130, y: 280 },
      { name: "Ang Mo Kio", x: 200, y: 220 },
      { name: "Sengkang", x: 280, y: 160 },
      { name: "Punggol", x: 350, y: 100 },
    ],
  },
  "Bus 12": {
    type: "bus",
    name: "Bus 12",
    dest: "Pasir Ris → Kampong Bahru",
    color: "hsl(var(--primary))",
    stops: [
      { name: "Pasir Ris Int", x: 350, y: 100 },
      { name: "Tampines", x: 300, y: 170 },
      { name: "Bedok", x: 240, y: 230 },
      { name: "Katong", x: 170, y: 290 },
      { name: "Kampong Bahru", x: 80, y: 350 },
    ],
  },
  "Bus 190": {
    type: "bus",
    name: "Bus 190",
    dest: "Choa Chu Kang → Kampong Bahru",
    color: "hsl(var(--warning))",
    stops: [
      { name: "Choa Chu Kang", x: 60, y: 100 },
      { name: "Bukit Batok", x: 120, y: 170 },
      { name: "Clementi", x: 190, y: 230 },
      { name: "Queenstown", x: 270, y: 290 },
      { name: "Kampong Bahru", x: 340, y: 350 },
    ],
  },
  "Circle Line": {
    type: "train",
    name: "Circle Line",
    dest: "Dhoby Ghaut → HarbourFront",
    color: "#fa9e0d",
    stops: [
      { name: "Dhoby Ghaut", x: 200, y: 80 },
      { name: "Bras Basah", x: 300, y: 120 },
      { name: "Paya Lebar", x: 350, y: 220 },
      { name: "MacPherson", x: 300, y: 300 },
      { name: "Bishan", x: 200, y: 350 },
      { name: "Botanic Gardens", x: 100, y: 300 },
      { name: "HarbourFront", x: 60, y: 200 },
    ],
  },
  "North-East Line": {
    type: "train",
    name: "North-East Line",
    dest: "HarbourFront → Punggol",
    color: "#9900aa",
    stops: [
      { name: "HarbourFront", x: 50, y: 350 },
      { name: "Outram Park", x: 100, y: 290 },
      { name: "Dhoby Ghaut", x: 150, y: 230 },
      { name: "Little India", x: 200, y: 190 },
      { name: "Serangoon", x: 260, y: 150 },
      { name: "Sengkang", x: 310, y: 110 },
      { name: "Punggol", x: 350, y: 80 },
    ],
  },
  "Thomson-East Coast Line": {
    type: "train",
    name: "Thomson-East Coast Line",
    dest: "Woodlands North → Bayshore",
    color: "#784008",
    stops: [
      { name: "Woodlands North", x: 60, y: 80 },
      { name: "Woodlands", x: 100, y: 130 },
      { name: "Caldecott", x: 160, y: 190 },
      { name: "Stevens", x: 210, y: 240 },
      { name: "Orchard", x: 260, y: 280 },
      { name: "Marina Bay", x: 310, y: 320 },
      { name: "Bayshore", x: 350, y: 360 },
    ],
  },
};

interface Props {
  vehicleKey: string;
  onClose: () => void;
}

const VehicleTrackingMap = ({ vehicleKey, onClose }: Props) => {
  const vehicle = routeData[vehicleKey];
  const [vehiclePos, setVehiclePos] = useState(0);
  const [eta, setEta] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    if (!vehicle) return;
    const totalStops = vehicle.stops.length;
    const totalDuration = 12000; // 12s to traverse full route
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      setVehiclePos(progress);
      setEta(Math.max(0, Math.ceil((1 - progress) * totalStops * 3)));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [vehicle]);

  if (!vehicle) return null;

  const stops = vehicle.stops;
  const totalLen = stops.length - 1;
  const segIndex = Math.min(Math.floor(vehiclePos * totalLen), totalLen - 1);
  const segProgress = (vehiclePos * totalLen) - segIndex;
  const from = stops[segIndex];
  const to = stops[Math.min(segIndex + 1, stops.length - 1)];
  const vx = from.x + (to.x - from.x) * segProgress;
  const vy = from.y + (to.y - from.y) * segProgress;

  const currentStopName = stops[Math.min(Math.round(vehiclePos * totalLen), totalLen)].name;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {vehicle.type === "bus" ? (
            <Bus className="w-5 h-5 text-primary" />
          ) : (
            <TrainFront className="w-5 h-5 text-primary" />
          )}
          <div>
            <p className="font-bold text-sm">{vehicle.name}</p>
            <p className="text-xs text-muted-foreground">{vehicle.dest}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-muted/30 overflow-hidden">
        {/* Fake map grid */}
        <svg width="100%" height="100%" viewBox="0 0 400 420" className="absolute inset-0">
          {/* Grid lines for map feel */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 22} x2={400} y2={i * 22} stroke="hsl(var(--border))" strokeWidth={0.5} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 22} y1={0} x2={i * 22} y2={420} stroke="hsl(var(--border))" strokeWidth={0.5} />
          ))}

          {/* Fake road shapes */}
          <rect x={30} y={180} width={340} height={8} rx={4} fill="hsl(var(--muted))" />
          <rect x={190} y={40} width={8} height={360} rx={4} fill="hsl(var(--muted))" />
          <rect x={80} y={100} width={250} height={6} rx={3} fill="hsl(var(--muted))" />
          <rect x={100} y={300} width={220} height={6} rx={3} fill="hsl(var(--muted))" />

          {/* Route path */}
          <polyline
            points={stops.map((s) => `${s.x},${s.y}`).join(" ")}
            fill="none"
            stroke={vehicle.color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 4"
          />

          {/* Stops */}
          {stops.map((s, i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={8} fill="hsl(var(--background))" stroke={vehicle.color} strokeWidth={2.5} />
              {i === 0 || i === stops.length - 1 ? (
                <circle cx={s.x} cy={s.y} r={4} fill={vehicle.color} />
              ) : (
                <circle cx={s.x} cy={s.y} r={3} fill={vehicle.color} opacity={0.5} />
              )}
              <text
                x={s.x}
                y={s.y - 14}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill="hsl(var(--foreground))"
              >
                {s.name}
              </text>
            </g>
          ))}

          {/* Animated vehicle marker */}
          <g>
            {/* Pulse ring */}
            <circle cx={vx} cy={vy} r={16} fill={vehicle.color} opacity={0.15}>
              <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Vehicle dot */}
            <circle cx={vx} cy={vy} r={10} fill={vehicle.color} stroke="hsl(var(--background))" strokeWidth={3} />
            {/* Vehicle icon text */}
            <text x={vx} y={vy + 3.5} textAnchor="middle" fontSize={10} fill="white" fontWeight={700}>
              {vehicle.type === "bus" ? "🚌" : "🚆"}
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-3 left-3 glass-card rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: vehicle.color }} />
            <span className="font-semibold">{vehicle.name}</span>
            <span className="text-muted-foreground">• Live</span>
          </div>
        </div>
      </div>

      {/* Bottom info panel */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Near: {currentStopName}</span>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            ETA {eta} min
          </span>
        </div>

        {/* Stop progress */}
        <div className="flex items-center gap-1">
          {stops.map((s, i) => {
            const stopProgress = i / totalLen;
            const isPassed = vehiclePos >= stopProgress;
            return (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-300 ${
                    isPassed ? "" : "bg-muted"
                  }`}
                  style={isPassed ? { background: vehicle.color } : {}}
                />
                {i < stops.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-colors duration-300 ${
                    vehiclePos >= (i + 1) / totalLen ? "" : "bg-muted"
                  }`}
                  style={vehiclePos >= (i + 1) / totalLen ? { background: vehicle.color } : {}}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{stops[0].name}</span>
          <span>{stops[stops.length - 1].name}</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleTrackingMap;
