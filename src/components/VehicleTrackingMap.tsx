import { useState, useEffect, useRef } from "react";
import { X, Bus, TrainFront, Navigation, Gauge, Clock } from "lucide-react";
import { generateRouteData, type VehicleInfo, type DestinationStop } from "@/data/destinations";

const routeData = generateRouteData();

interface Props {
  vehicleKey: string;
  onClose: () => void;
}

const VehicleTrackingMap = ({ vehicleKey, onClose }: Props) => {
  const vehicle = routeData[vehicleKey];
  const [vehiclePos, setVehiclePos] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isAtStop, setIsAtStop] = useState(false);
  const animRef = useRef<number>();

  useEffect(() => {
    if (!vehicle) return;
    const totalDuration = 20000;
    const startTime = Date.now();
    const numStops = vehicle.stops.length;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / totalDuration, 1);

      // Ease in/out between stops for realistic feel
      const segLength = 1 / (numStops - 1);
      const segIdx = Math.floor(rawProgress / segLength);
      const segLocal = (rawProgress % segLength) / segLength;

      // Slow down near stops (ease in-out cubic)
      const eased = segLocal < 0.5
        ? 4 * segLocal * segLocal * segLocal
        : 1 - Math.pow(-2 * segLocal + 2, 3) / 2;

      const progress = Math.min(segIdx * segLength + eased * segLength, 1);
      setVehiclePos(progress);

      // Speed simulation (km/h) — slow near stops
      const nearStop = segLocal < 0.1 || segLocal > 0.9;
      setIsAtStop(segLocal < 0.05 || rawProgress >= 0.99);
      setSpeed(nearStop ? Math.round(5 + Math.random() * 10) : Math.round(30 + Math.random() * 40));

      if (rawProgress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpeed(0);
        setIsAtStop(true);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
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
  const currentStopIdx = Math.min(Math.round(vehiclePos * totalLen), totalLen);
  const currentStopName = stops[currentStopIdx].name;
  const eta = Math.max(0, Math.ceil((1 - vehiclePos) * totalLen * 3));

  // Build smooth path using quadratic bezier curves
  const buildPath = (pts: DestinationStop[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cx = (prev.x + curr.x) / 2;
      const cy = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x + (curr.x - prev.x) * 0.3} ${prev.y + (curr.y - prev.y) * 0.1}, ${cx} ${cy}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
  };

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
        <svg width="100%" height="100%" viewBox="0 0 400 420" className="absolute inset-0">
          {/* Grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 22} x2={400} y2={i * 22} stroke="hsl(var(--border))" strokeWidth={0.3} opacity={0.5} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 22} y1={0} x2={i * 22} y2={420} stroke="hsl(var(--border))" strokeWidth={0.3} opacity={0.5} />
          ))}

          {/* Fake roads */}
          <rect x={30} y={180} width={340} height={6} rx={3} fill="hsl(var(--muted))" opacity={0.6} />
          <rect x={190} y={40} width={6} height={360} rx={3} fill="hsl(var(--muted))" opacity={0.6} />
          <rect x={80} y={100} width={250} height={4} rx={2} fill="hsl(var(--muted))" opacity={0.4} />
          <rect x={100} y={300} width={220} height={4} rx={2} fill="hsl(var(--muted))" opacity={0.4} />

          {/* Route path - smooth */}
          <path
            d={buildPath(stops)}
            fill="none"
            stroke={vehicle.color}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.3}
          />
          {/* Active/traveled route */}
          <path
            d={buildPath(stops)}
            fill="none"
            stroke={vehicle.color}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray={`${vehiclePos * 1000} 1000`}
          />

          {/* Stops */}
          {stops.map((s, i) => {
            const stopProgress = i / totalLen;
            const isPassed = vehiclePos >= stopProgress;
            const isCurrent = i === currentStopIdx;
            return (
              <g key={i}>
                <circle
                  cx={s.x} cy={s.y} r={isCurrent ? 10 : 7}
                  fill="hsl(var(--background))"
                  stroke={isPassed ? vehicle.color : "hsl(var(--border))"}
                  strokeWidth={isCurrent ? 3 : 2}
                />
                {(i === 0 || i === stops.length - 1) && (
                  <circle cx={s.x} cy={s.y} r={4} fill={vehicle.color} />
                )}
                {isPassed && i !== 0 && i !== stops.length - 1 && (
                  <circle cx={s.x} cy={s.y} r={3} fill={vehicle.color} />
                )}
                <text
                  x={s.x}
                  y={s.y - (isCurrent ? 16 : 12)}
                  textAnchor="middle"
                  fontSize={isCurrent ? 10 : 8}
                  fontWeight={isCurrent ? 700 : 500}
                  fill="hsl(var(--foreground))"
                >
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Vehicle marker */}
          <g>
            <circle cx={vx} cy={vy} r={18} fill={vehicle.color} opacity={0.12}>
              <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.04;0.15" dur="2s" repeatCount="indefinite" />
            </circle>
            {isAtStop && (
              <circle cx={vx} cy={vy} r={24} fill={vehicle.color} opacity={0.06}>
                <animate attributeName="r" values="20;30;20" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={vx} cy={vy} r={12} fill={vehicle.color} stroke="hsl(var(--background))" strokeWidth={3} />
            <text x={vx} y={vy + 4} textAnchor="middle" fontSize={11} fill="white" fontWeight={700}>
              {vehicle.type === "bus" ? "🚌" : "🚆"}
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-3 left-3 glass-card rounded-lg px-3 py-2 text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: vehicle.color }} />
            <span className="font-semibold">{vehicle.name}</span>
            <span className="text-muted-foreground">• Live</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-3 h-3" />
            <span>{speed} km/h</span>
            {isAtStop && <span className="text-primary font-medium">• At stop</span>}
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              ETA {eta} min
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.round(vehiclePos * 100)}%
            </span>
          </div>
        </div>

        {/* Stop progress */}
        <div className="flex items-center gap-1">
          {stops.map((s, i) => {
            const stopProgress = i / totalLen;
            const isPassed = vehiclePos >= stopProgress;
            return (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${isPassed ? "scale-110" : "bg-muted"}`}
                  style={isPassed ? { background: vehicle.color } : {}}
                />
                {i < stops.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-300 ${vehiclePos >= (i + 1) / totalLen ? "" : "bg-muted"}`}
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
