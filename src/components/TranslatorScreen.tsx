import { useState } from "react";
import { Copy, Check, ArrowDownUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
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
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("quickTranslator")}</h1>

      <div className="flex items-center gap-2">
        <select
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          className="flex-1 rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring"
        >
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button onClick={swap} className="p-2 rounded-full bg-primary/10 text-primary">
          <ArrowDownUp className="w-4 h-4" />
        </button>
        <select
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          className="flex-1 rounded-xl bg-secondary text-secondary-foreground px-3 py-2.5 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring"
        >
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("typePlaceholder")}
        className="w-full h-32 rounded-xl bg-card border border-border p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />

      <Button onClick={translate} disabled={loading || !input.trim()} className="w-full rounded-xl h-11 font-semibold">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {t("translateBtn")}
      </Button>

      {output && (
        <div className="glass-card rounded-xl p-4 relative">
          <p className="text-sm leading-relaxed pr-8">{output}</p>
          <button onClick={copy} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslatorScreen;
