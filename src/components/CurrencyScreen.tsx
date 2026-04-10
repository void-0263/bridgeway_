import { useState, useEffect } from "react";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const currencies = ["USD", "EUR", "INR", "SGD", "GBP", "MYR", "AED", "BDT", "PHP", "THB"];

const CurrencyScreen = () => {
  const { t } = useI18n();
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("SGD");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
      const data = await res.json();
      if (data.rates?.[to]) {
        setResult(data.rates[to]);
        // Calculate the rate for 1 unit
        const rateRes = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${from}&to=${to}`);
        const rateData = await rateRes.json();
        setRate(rateData.rates?.[to] || null);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error("Currency conversion error:", err);
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); setRate(null); };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">{t("currencyConverter")}</h1>

      <div className="glass-card rounded-xl p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("amount")}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
            className="w-full rounded-xl bg-secondary text-foreground px-4 py-3 text-lg font-semibold border-0 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("from")}</label>
            <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-5 p-2 rounded-full bg-primary/10 text-primary">
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("to")}</label>
            <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={convert} disabled={loading || from === to} className="w-full rounded-xl h-11 font-semibold">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {t("convert")}
        </Button>
      </div>

      {result !== null && (
        <div className="glass-card rounded-xl p-5 text-center space-y-1">
          <p className="text-3xl font-extrabold text-primary">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
          </p>
          {rate !== null && (
            <p className="text-xs text-muted-foreground">
              1 {from} = {rate.toFixed(4)} {to} (live rate)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyScreen;
