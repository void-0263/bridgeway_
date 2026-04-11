import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Info, Shield, Plane, DollarSign, Cloud, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import AnimatedPage from "./AnimatedPage";

interface Announcement {
  title: string;
  body: string;
  category: string;
  urgency: string;
  time: string;
}

const countryTabs = [
  { id: "Singapore", label: "🇸🇬 Singapore" },
  { id: "India", label: "🇮🇳 India" },
  { id: "Dubai/UAE", label: "🇦🇪 Dubai" },
  { id: "United States", label: "🇺🇸 America" },
  { id: "Japan", label: "🇯🇵 Japan" },
  { id: "China", label: "🇨🇳 China" },
];

const categoryIcons: Record<string, typeof Bell> = {
  travel: Plane,
  safety: Shield,
  finance: DollarSign,
  labor: Info,
  weather: Cloud,
  transport: Plane,
};

const urgencyStyles: Record<string, string> = {
  alert: "bg-destructive/10 border-destructive/30 text-destructive",
  warning: "bg-warning/10 border-warning/30 text-warning",
  info: "bg-primary/10 border-primary/30 text-primary",
};

const MessagesScreen = () => {
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState("Singapore");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async (country: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("announcements", {
        body: { country },
      });
      if (fnError) throw fnError;
      setAnnouncements(data.announcements || []);
    } catch (err: any) {
      console.error("Announcements error:", err);
      setError("Failed to load announcements. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(selectedCountry);
  }, [selectedCountry]);

  return (
    <AnimatedPage>
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Live Alerts & Updates</h1>
          <p className="text-xs text-muted-foreground">Important news for workers abroad</p>
        </div>
      </div>

      {/* Country tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {countryTabs.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              selectedCountry === c.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching latest updates…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <AlertTriangle className="w-8 h-8 text-warning" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" onClick={() => fetchAnnouncements(selectedCountry)}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Announcements */}
      {!loading && !error && (
        <div className="space-y-3">
          {announcements.map((a, i) => {
            const Icon = categoryIcons[a.category] || Info;
            const urgency = urgencyStyles[a.urgency] || urgencyStyles.info;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 space-y-2 transition-all ${urgency}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm leading-tight text-foreground">{a.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{a.body}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                    {a.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{a.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs gap-1.5"
            onClick={() => fetchAnnouncements(selectedCountry)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Updates
          </Button>
        </div>
      )}
    </div>
    </AnimatedPage>
  );
};

export default MessagesScreen;
