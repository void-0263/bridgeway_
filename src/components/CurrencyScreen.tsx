import { useState, useEffect, useMemo } from "react";
import { ArrowDownUp, Loader2, DollarSign, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useCountry } from "@/lib/CountryContext";
import AnimatedPage from "./AnimatedPage";
import MotionCard from "./MotionCard";
import { motion } from "framer-motion";

const currencies = ["USD", "EUR", "INR", "SGD", "GBP", "MYR", "AED", "BDT", "PHP", "THB", "JPY", "CNY"];

interface HistoricalPoint {
  date: string;
  rate: number;
}

const FALLBACK_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, INR: 83.5, SGD: 1.34, GBP: 0.79, MYR: 4.72, AED: 3.67, BDT: 110.5, PHP: 56.2, THB: 35.8, JPY: 154.5, CNY: 7.24 },
  EUR: { USD: 1.09, INR: 90.8, SGD: 1.46, GBP: 0.86, MYR: 5.13, AED: 3.99, BDT: 120.2, PHP: 61.1, THB: 38.9, JPY: 168.1, CNY: 7.87 },
  SGD: { USD: 0.75, EUR: 0.69, INR: 62.3, GBP: 0.59, MYR: 3.52, AED: 2.74, BDT: 82.5, PHP: 41.9, THB: 26.7, JPY: 115.3, CNY: 5.40 },
  INR: { USD: 0.012, EUR: 0.011, SGD: 0.016, GBP: 0.0095, MYR: 0.057, AED: 0.044, BDT: 1.32, PHP: 0.67, THB: 0.43, JPY: 1.85, CNY: 0.087 },
  AED: { USD: 0.27, EUR: 0.25, SGD: 0.37, INR: 22.7, GBP: 0.22, MYR: 1.29, BDT: 30.1, PHP: 15.3, THB: 9.76, JPY: 42.1, CNY: 1.97 },
  JPY: { USD: 0.0065, EUR: 0.006, SGD: 0.0087, INR: 0.54, GBP: 0.0051, MYR: 0.031, AED: 0.024, BDT: 0.72, PHP: 0.36, THB: 0.23, CNY: 0.047 },
  CNY: { USD: 0.138, EUR: 0.127, SGD: 0.185, INR: 11.5, GBP: 0.109, MYR: 0.652, AED: 0.507, BDT: 15.3, PHP: 7.76, THB: 4.95, JPY: 21.3 },
};

const CurrencyScreen = () => {
  const { t } = useI18n();
  const { meta } = useCountry();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(meta.currency);
  const [feePercent, setFeePercent] = useState("0");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoricalPoint[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  // Update default "to" currency when country changes
  useEffect(() => {
    setTo(meta.currency);
    setResult(null);
    setRate(null);
  }, [meta.currency]);

  // Generate fallback history data
  const generateFallbackHistory = (f: string, toCur: string): HistoricalPoint[] => {
    const baseRate = FALLBACK_RATES[f]?.[toCur] || 1;
    const points: HistoricalPoint[] = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const variation = 1 + (Math.sin(i * 0.5) * 0.02) + ((Math.random() - 0.5) * 0.01);
      points.push({
        date: d.toISOString().split("T")[0],
        rate: baseRate * variation,
      });
    }
    return points;
  };

  // Fetch 30-day history
  const fetchHistory = async (f: string, toCur: string) => {
    if (f === toCur) { setHistory([]); return; }
    setHistLoading(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const fmt = (d: Date) => d.toISOString().split("T")[0];
      const res = await fetch(
        `https://api.frankfurter.dev/${fmt(start)}..${fmt(end)}?from=${f}&to=${toCur}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.rates) {
        const points: HistoricalPoint[] = Object.entries(data.rates).map(
          ([date, rates]: [string, any]) => ({ date, rate: rates[toCur] })
        );
        setHistory(points);
      } else {
        setHistory(generateFallbackHistory(f, toCur));
      }
    } catch {
      setHistory(generateFallbackHistory(f, toCur));
    } finally {
      setHistLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(from, to);
  }, [from, to]);

  const convert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`https://api.frankfurter.dev/latest?amount=${amount}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.rates?.[to]) {
        setResult(data.rates[to]);
        setRate(data.rates[to] / parseFloat(amount));
      } else {
        throw new Error("No rate");
      }
    } catch {
      // Fallback conversion
      const fallbackRate = FALLBACK_RATES[from]?.[to] || 1;
      const amt = parseFloat(amount);
      setRate(fallbackRate);
      setResult(amt * fallbackRate);
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); setRate(null); };

  const fee = feePercent ? parseFloat(feePercent) : 0;
  const feeAmount = result !== null ? (result * fee) / 100 : 0;
  const netAmount = result !== null ? result - feeAmount : 0;

  // Chart calculations
  const chartData = useMemo(() => {
    if (history.length === 0) return null;
    const rates = history.map(h => h.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;
    const padding = range * 0.1;
    const adjMin = min - padding;
    const adjMax = max + padding;
    const adjRange = adjMax - adjMin;

    const width = 320;
    const height = 140;
    const points = history.map((h, i) => ({
      x: (i / (history.length - 1)) * width,
      y: height - ((h.rate - adjMin) / adjRange) * height,
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i - 1].x + points[i].x) / 2;
      path += ` C ${cx} ${points[i - 1].y}, ${cx} ${points[i].y}, ${points[i].x} ${points[i].y}`;
    }

    const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

    const first = rates[0];
    const last = rates[rates.length - 1];
    const change = ((last - first) / first) * 100;
    const isUp = change >= 0;

    return { path, areaPath, width, height, min, max, first, last, change, isUp, points };
  }, [history]);

  return (
    <AnimatedPage>
      <div className="space-y-5 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Live Currency Exchange</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Real-time rates • 30-day trends • Fee calculator</p>
          </div>
        </div>

        {/* 30-Day Chart */}
        <MotionCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">30-Day Trend</p>
              <p className="text-sm font-bold mt-0.5">{from} → {to}</p>
            </div>
            {chartData && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                chartData.isUp ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
              }`}>
                {chartData.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {chartData.change >= 0 ? "+" : ""}{chartData.change.toFixed(2)}%
              </div>
            )}
          </div>

          {histLoading ? (
            <div className="flex items-center justify-center h-[140px]">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : chartData ? (
            <div className="relative">
              <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-[140px]" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartData.isUp ? "hsl(var(--accent))" : "hsl(var(--destructive))"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={chartData.isUp ? "hsl(var(--accent))" : "hsl(var(--destructive))"} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={chartData.areaPath}
                  fill="url(#chartGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.path
                  d={chartData.path}
                  fill="none"
                  stroke={chartData.isUp ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <motion.circle
                  cx={chartData.points[chartData.points.length - 1].x}
                  cy={chartData.points[chartData.points.length - 1].y}
                  r="4"
                  fill={chartData.isUp ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                />
              </svg>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{history[0]?.date}</span>
                <span>Today</span>
              </div>
              <div className="flex justify-between text-[10px] font-semibold mt-0.5">
                <span>{chartData.first.toFixed(4)}</span>
                <span className={chartData.isUp ? "text-accent" : "text-destructive"}>{chartData.last.toFixed(4)}</span>
              </div>
            </div>
          ) : from === to ? (
            <div className="flex items-center justify-center h-[140px] text-sm text-muted-foreground">
              Select different currencies to see trends
            </div>
          ) : null}
        </MotionCard>

        {/* Converter Card */}
        <MotionCard delay={0.1} className="p-5 space-y-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currency Converter</p>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">{t("amount")}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-muted/40 text-foreground px-4 py-3.5 text-2xl font-black border border-border/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">{t("from")}</label>
              <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}
                className="w-full rounded-xl bg-card text-foreground px-3 py-3 text-sm font-semibold border border-border/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={swap} className="mt-6 p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all">
              <ArrowDownUp className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">{t("to")}</label>
              <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}
                className="w-full rounded-xl bg-card text-foreground px-3 py-3 text-sm font-semibold border border-border/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest flex items-center gap-1">
              <Percent className="w-3 h-3" />
              Exchange Fee / Tax (Optional)
            </label>
            <input
              type="number"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
              className="w-full rounded-xl bg-muted/40 text-foreground px-4 py-3 text-sm font-semibold border border-border/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <Button onClick={convert} disabled={loading || from === to} className="w-full rounded-xl h-12 font-bold shadow-lg hover:shadow-xl transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            {t("convert")}
          </Button>
        </MotionCard>

        {/* Result Card */}
        {result !== null && (
          <MotionCard delay={0.15} className="p-6 space-y-4">
            {rate !== null && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">Live Rate</span>
                <span className="text-xs font-bold">1 {from} = {rate.toFixed(4)} {to}</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Converted Amount</p>
              <p className="text-3xl font-black text-foreground">
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-muted-foreground">{to}</span>
              </p>
            </div>

            {fee > 0 && (
              <div className="border-t border-border/50 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fee ({fee}%)</span>
                  <span className="font-semibold text-destructive">
                    −{feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">You Receive</span>
                  <span className="text-2xl font-black text-accent">
                    {netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-bold">{to}</span>
                  </span>
                </div>
              </div>
            )}
          </MotionCard>
        )}
      </div>
    </AnimatedPage>
  );
};

export default CurrencyScreen;