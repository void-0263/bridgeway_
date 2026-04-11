import { useState } from "react";
import { Copy, Check, ArrowDownUp, Loader2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { languages } from "@/lib/translations";
import AnimatedPage from "./AnimatedPage";
import { supabase } from "@/integrations/supabase/client";
import { languages } from "@/lib/translations";

const TranslatorScreen = () => {
  const { t } = useI18n();
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState("Hindi");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text: input, fromLang, toLang },
      });
      if (error) throw error;
      setOutput(data.translation || "Translation failed");
    } catch (err) {
      console.error("Translation error:", err);
      setOutput("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInput(output);
    setOutput("");
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatedPage>
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Languages className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">{t("quickTranslator")}</h1>
          <p className="text-xs text-muted-foreground">Powered by AI • Instant results</p>
        </div>
      </div>

      {/* Language selectors */}
      <div className="flex items-center gap-2">
        <select
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          className="flex-1 rounded-xl bg-card text-foreground px-3 py-3 text-sm font-medium border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
        >
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button onClick={swap} className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <ArrowDownUp className="w-4 h-4" />
        </button>
        <select
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          className="flex-1 rounded-xl bg-card text-foreground px-3 py-3 text-sm font-medium border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
        >
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("typePlaceholder")}
        className="w-full h-36 rounded-xl bg-card border border-border p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground shadow-sm"
      />

      {/* Translate button */}
      <Button onClick={translate} disabled={loading || !input.trim()} className="w-full rounded-xl h-12 font-bold text-sm shadow-md">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {t("translateBtn")}
      </Button>

      {/* Output */}
      {output && (
        <div className="glass-card rounded-xl p-4 relative">
          <p className="text-sm leading-relaxed pr-8 text-foreground">{output}</p>
          <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
    </AnimatedPage>
  );
};

export default TranslatorScreen;
