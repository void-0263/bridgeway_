import { useState } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages = ["English", "Hindi", "Tamil", "Spanish", "Mandarin", "Malay", "Bengali", "Tagalog", "Thai"];

const mockTranslations: Record<string, Record<string, Record<string, string>>> = {
  English: {
    Hindi: { "hello": "नमस्ते", "thank you": "धन्यवाद", "where is the bus stop?": "बस स्टॉप कहाँ है?", "how much does this cost?": "इसकी कीमत कितनी है?" },
    Spanish: { "hello": "hola", "thank you": "gracias", "where is the bus stop?": "¿dónde está la parada de autobús?", "how much does this cost?": "¿cuánto cuesta esto?" },
    Tamil: { "hello": "வணக்கம்", "thank you": "நன்றி", "where is the bus stop?": "பேருந்து நிறுத்தம் எங்கே?", "how much does this cost?": "இதன் விலை எவ்வளவு?" },
    Mandarin: { "hello": "你好", "thank you": "谢谢", "where is the bus stop?": "公交车站在哪里？", "how much does this cost?": "这个多少钱？" },
    Malay: { "hello": "hello", "thank you": "terima kasih", "where is the bus stop?": "di mana perhentian bas?", "how much does this cost?": "berapa harganya?" },
  },
};

const TranslatorScreen = () => {
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState("Hindi");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const translate = () => {
    const key = input.trim().toLowerCase();
    const result = mockTranslations[fromLang]?.[toLang]?.[key];
    setOutput(result || `[Mock] Translated "${input}" from ${fromLang} to ${toLang}`);
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
      <h1 className="text-xl font-bold">Quick Translator</h1>

      {/* Language selectors */}
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

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type text to translate…"
        className="w-full h-32 rounded-xl bg-card border border-border p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />

      <Button onClick={translate} className="w-full rounded-xl h-11 font-semibold">
        Translate
      </Button>

      {/* Output */}
      {output && (
        <div className="glass-card rounded-xl p-4 relative">
          <p className="text-sm leading-relaxed pr-8">{output}</p>
          <button onClick={copy} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Try: "hello", "thank you", "where is the bus stop?", "how much does this cost?"
      </p>
    </div>
  );
};

export default TranslatorScreen;
