import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const rates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, INR: 83.12, SGD: 1.34, GBP: 0.79, MYR: 4.72, AED: 3.67 },
  EUR: { USD: 1.09, INR: 90.45, SGD: 1.46, GBP: 0.86, MYR: 5.14, AED: 3.99 },
  INR: { USD: 0.012, EUR: 0.011, SGD: 0.016, GBP: 0.0095, MYR: 0.057, AED: 0.044 },
  SGD: { USD: 0.75, EUR: 0.69, INR: 62.03, GBP: 0.59, MYR: 3.52, AED: 2.74 },
  GBP: { USD: 1.27, EUR: 1.16, INR: 105.21, SGD: 1.70, MYR: 5.98, AED: 4.65 },
  MYR: { USD: 0.21, EUR: 0.19, INR: 17.62, SGD: 0.28, GBP: 0.17, AED: 0.78 },
  AED: { USD: 0.27, EUR: 0.25, INR: 22.65, SGD: 0.37, GBP: 0.22, MYR: 1.29 },
};

const currencies = Object.keys(rates);

const CurrencyScreen = () => {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("SGD");
  const [result, setResult] = useState<number | null>(null);

  const convert = () => {
    if (from === to) { setResult(parseFloat(amount)); return; }
    const rate = rates[from]?.[to] ?? 1;
    setResult(parseFloat(amount) * rate);
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };
  const rate = from === to ? 1 : (rates[from]?.[to] ?? 1);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Currency Converter</h1>

      <div className="glass-card rounded-xl p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
            className="w-full rounded-xl bg-secondary text-foreground px-4 py-3 text-lg font-semibold border-0 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
            <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-5 p-2 rounded-full bg-primary/10 text-primary">
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
            <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={convert} className="w-full rounded-xl h-11 font-semibold">Convert</Button>
      </div>

      {result !== null && (
        <div className="glass-card rounded-xl p-5 text-center space-y-1">
          <p className="text-3xl font-extrabold text-primary">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
          </p>
          <p className="text-xs text-muted-foreground">
            1 {from} = {rate.toFixed(4)} {to} (mock rate)
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyScreen;
