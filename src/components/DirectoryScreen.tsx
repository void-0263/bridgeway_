import { useState } from "react";
import { Search, Star, Navigation } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Place {
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
}

const places: Place[] = [
  { name: "Ananda Bhavan", category: "Indian Restaurants", rating: 4.5, address: "95 Syed Alwi Rd", phone: "+65 6392 5545" },
  { name: "Komala Vilas", category: "Indian Restaurants", rating: 4.3, address: "76 Serangoon Rd", phone: "+65 6293 6980" },
  { name: "Mustafa Centre", category: "Supermarkets", rating: 4.4, address: "145 Syed Alwi Rd", phone: "+65 6295 5855" },
  { name: "FairPrice Xtra", category: "Supermarkets", rating: 4.2, address: "21 Tampines Ave 1", phone: "+65 6788 1234" },
  { name: "Sheng Siong", category: "Supermarkets", rating: 4.1, address: "6 Ang Mo Kio St 21", phone: "+65 6555 0123" },
  { name: "Raffles Medical", category: "Clinics", rating: 4.6, address: "1 Raffles Place", phone: "+65 6311 1111" },
  { name: "Healthway Medical", category: "Clinics", rating: 4.0, address: "302 Tiong Bahru Rd", phone: "+65 6252 0122" },
  { name: "Indian High Commission", category: "Embassies", rating: 4.1, address: "31 Grange Rd", phone: "+65 6737 6777" },
  { name: "US Embassy", category: "Embassies", rating: 4.0, address: "27 Napier Rd", phone: "+65 6476 9100" },
  { name: "La Picara Tapas Bar", category: "Indian Restaurants", rating: 4.7, address: "50 Cluny Park Rd", phone: "+65 6887 0011" },
];

const categories = ["All", "Indian Restaurants", "Supermarkets", "Clinics", "Embassies"];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-warning text-warning" : "text-muted"}`} />
    ))}
    <span className="text-xs text-muted-foreground ml-1">{rating}</span>
  </div>
);

const DirectoryScreen = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = places.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("localDirectory")}</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaces")}
          className="w-full rounded-xl bg-card border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {c === "All" ? t("all") : c}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No places found.</p>
        )}
        {filtered.map((p, i) => (
          <div key={i} className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <Stars rating={p.rating} />
            </div>
            <p className="text-xs text-muted-foreground">{p.address} · {p.phone}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.name + ", " + p.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-primary"
            >
              <Navigation className="w-3.5 h-3.5" />
              {t("getDirections")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryScreen;
