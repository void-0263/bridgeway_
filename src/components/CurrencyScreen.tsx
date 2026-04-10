import { useState, useEffect } from "react";
import { ArrowDownUp, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const currencies = ["USD", "EUR", "INR", "SGD", "GBP", "MYR", "AED", "BDT", "PHP", "THB", "JPY", "CNY"];

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
        const rateRes = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${from}&to=${to}`);
        const rateData = await rateRes.json();
        setRate(rateData.rates?.[to] || null);
      }
    } catch (err) {
      console.error("Currency error:", err);
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); setRate(null); };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">{t("currencyConverter")}</h1>
          <p className="text-xs text-muted-foreground">Live exchange rates • 12 currencies</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">{t("amount")}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
            className="w-full rounded-xl bg-muted/50 text-foreground px-4 py-3 text-xl font-bold border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">{t("from")}</label>
            <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-card text-foreground px-3 py-3 text-sm font-medium border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-6 p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">{t("to")}</label>
            <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-card text-foreground px-3 py-3 text-sm font-medium border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={convert} disabled={loading || from === to} className="w-full rounded-xl h-12 font-bold shadow-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {t("convert")}
        </Button>
      </div>

      {result !== null && (
        <div className="glass-card rounded-xl p-6 text-center space-y-2">
          <p className="text-3xl font-extrabold text-primary">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg">{to}</span>
          </p>
          {rate !== null && (
            <p className="text-xs text-muted-foreground">
              1 {from} = {rate.toFixed(4)} {to} • Live rate
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyScreen;
