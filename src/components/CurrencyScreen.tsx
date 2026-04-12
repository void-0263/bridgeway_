import { useState } from "react";
import { ArrowDownUp, Loader2, DollarSign, Percent, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import AnimatedPage from "./AnimatedPage";
import MotionCard from "./MotionCard";

const currencies = ["USD", "EUR", "INR", "SGD", "GBP", "MYR", "AED", "BDT", "PHP", "THB", "JPY", "CNY"];

const CurrencyScreen = () => {
  const { t } = useI18n();
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("SGD");
  const [feePercent, setFeePercent] = useState("0");
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

  const fee = feePercent ? parseFloat(feePercent) : 0;
  const feeAmount = result !== null ? (result * fee) / 100 : 0;
  const netAmount = result !== null ? result - feeAmount : 0;

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
            <p className="text-[11px] text-muted-foreground font-medium">Real-time rates • Fee calculator</p>
          </div>
        </div>

        {/* Converter Card */}
        <MotionCard className="p-5 space-y-4">
          {/* Amount */}
          <div>
            <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">{t("amount")}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setResult(null); }}
              className="w-full rounded-xl bg-muted/40 text-foreground px-4 py-3.5 text-2xl font-black border border-border/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Currency Selectors */}
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

          {/* Fee Input */}
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
          <MotionCard delay={0.1} className="p-6 space-y-4">
            {/* Live Rate */}
            {rate !== null && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">Live Rate</span>
                <span className="text-xs font-bold">1 {from} = {rate.toFixed(4)} {to}</span>
              </div>
            )}

            {/* Gross Amount */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Converted Amount</p>
              <p className="text-3xl font-black text-foreground">
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-muted-foreground">{to}</span>
              </p>
            </div>

            {/* Fee Breakdown */}
            {fee > 0 && (
              <>
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
              </>
            )}
          </MotionCard>
        )}
      </div>
    </AnimatedPage>
  );
};

export default CurrencyScreen;
