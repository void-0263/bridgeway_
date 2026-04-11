import { Phone, ShieldAlert, Bus, Heart, Globe, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import { useCountry, type Country } from "@/lib/CountryContext";
import AnimatedPage from "./AnimatedPage";
import MotionCard from "./MotionCard";

interface EmergencyContact {
  label: string;
  number: string;
  icon: typeof Phone;
}

interface CulturalTip {
  title: string;
  description: string;
}

interface GuideData {
  emergency: EmergencyContact[];
  transport: string[];
  tips: CulturalTip[];
}

const guideByCountry: Record<Country, GuideData> = {
  singapore: {
    emergency: [
      { label: "Police", number: "999", icon: ShieldAlert },
      { label: "Ambulance / Fire", number: "995", icon: Phone },
      { label: "Non-Emergency", number: "1800-255-0000", icon: Phone },
      { label: "MOM Helpline", number: "6438-5122", icon: Heart },
    ],
    transport: [
      "Use EZ-Link or SimplyGo contactless cards for MRT/Bus",
      "MRT runs 5:30 AM – 12:00 AM daily",
      "Grab is the primary ride-hailing app",
      "Download MyTransport.SG for real-time bus arrivals",
    ],
    tips: [
      { title: "No chewing gum", description: "Chewing gum is banned except for medical purposes" },
      { title: "Fines for littering", description: "Fines start at S$300 for first offense" },
      { title: "Tipping not expected", description: "Service charge is included in bills" },
      { title: "Hawker centers", description: "Affordable food courts found across the island" },
    ],
  },
  india: {
    emergency: [
      { label: "Police", number: "100", icon: ShieldAlert },
      { label: "Ambulance", number: "108", icon: Phone },
      { label: "Fire", number: "101", icon: Phone },
      { label: "Women Helpline", number: "1091", icon: Heart },
    ],
    transport: [
      "Metro available in Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad",
      "Use Ola and Uber for ride-hailing",
      "Local trains are the lifeline in Mumbai",
      "Auto-rickshaws: always negotiate fare or use meter",
    ],
    tips: [
      { title: "Bargaining is common", description: "Negotiate prices at markets and with auto-rickshaws" },
      { title: "Remove shoes", description: "Take shoes off before entering temples and homes" },
      { title: "Right hand rule", description: "Use right hand for eating and exchanging money" },
      { title: "Drink bottled water", description: "Avoid tap water; sealed bottles are widely available" },
    ],
  },
  dubai: {
    emergency: [
      { label: "Police", number: "999", icon: ShieldAlert },
      { label: "Ambulance", number: "998", icon: Phone },
      { label: "Fire", number: "997", icon: Phone },
      { label: "Tourist Police", number: "800-4438", icon: Heart },
    ],
    transport: [
      "Dubai Metro: Red & Green lines, Nol card required",
      "RTA buses cover the city extensively",
      "Water taxis (abras) cross Dubai Creek for 1 AED",
      "Careem & Uber available for ride-hailing",
    ],
    tips: [
      { title: "Dress modestly", description: "Cover shoulders and knees in malls and public areas" },
      { title: "No public intoxication", description: "Drinking in public is illegal; only in licensed venues" },
      { title: "Friday is holy", description: "Friday is the weekend prayer day; some services close" },
      { title: "Respect Ramadan", description: "No eating/drinking in public during fasting hours" },
    ],
  },
  america: {
    emergency: [
      { label: "Emergency (All)", number: "911", icon: ShieldAlert },
      { label: "Poison Control", number: "1-800-222-1222", icon: Phone },
      { label: "Non-Emergency", number: "311", icon: Phone },
      { label: "Crisis Hotline", number: "988", icon: Heart },
    ],
    transport: [
      "NYC: MetroCard/OMNY for Subway & Buses",
      "SF: Clipper Card for BART & Muni",
      "LA: TAP card for Metro — car culture still dominates",
      "Uber, Lyft available nationwide",
    ],
    tips: [
      { title: "Tipping is expected", description: "15-20% at restaurants, $1-2 per drink at bars" },
      { title: "Carry ID always", description: "You may be carded for age-restricted purchases" },
      { title: "Sales tax varies", description: "Prices displayed don't include tax — it's added at checkout" },
      { title: "Healthcare is expensive", description: "Always have insurance; ER visits can cost thousands" },
    ],
  },
  japan: {
    emergency: [
      { label: "Police", number: "110", icon: ShieldAlert },
      { label: "Fire / Ambulance", number: "119", icon: Phone },
      { label: "JNTO Tourist Line", number: "050-3816-2787", icon: Globe },
      { label: "Immigration", number: "0570-013-904", icon: Heart },
    ],
    transport: [
      "Get a Suica/Pasmo card for trains and convenience stores",
      "JR Pass for long-distance Shinkansen travel",
      "Tokyo Metro runs ~5 AM to midnight",
      "Punctuality is king — trains leave exactly on time",
    ],
    tips: [
      { title: "Bow when greeting", description: "A slight bow is the standard greeting" },
      { title: "No tipping", description: "Tipping is considered rude in Japan" },
      { title: "Quiet on trains", description: "Phone calls and loud talk are frowned upon" },
      { title: "Shoes off indoors", description: "Remove shoes at homes, temples, and some restaurants" },
    ],
  },
  china: {
    emergency: [
      { label: "Police", number: "110", icon: ShieldAlert },
      { label: "Ambulance", number: "120", icon: Phone },
      { label: "Fire", number: "119", icon: Phone },
      { label: "Traffic Accident", number: "122", icon: Heart },
    ],
    transport: [
      "Metro systems in all major cities — use Alipay/WeChat Pay QR",
      "DiDi is the main ride-hailing app",
      "High-speed rail connects major cities (12306.cn for tickets)",
      "Shared bikes (Meituan, Hello) available everywhere via app",
    ],
    tips: [
      { title: "VPN needed", description: "Google, WhatsApp, Facebook are blocked — use a VPN" },
      { title: "WeChat is essential", description: "Used for payments, messaging, and daily services" },
      { title: "Bargain at markets", description: "Negotiate prices at street markets, not in malls" },
      { title: "Avoid sensitive topics", description: "Politics and history can be sensitive subjects" },
    ],
  },
};

const LocalGuideScreen = () => {
  const { country, countryLabel } = useCountry();
  const guide = guideByCountry[country];

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-warning-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold">Local Guide</h1>
            <p className="text-xs text-muted-foreground">{countryLabel} • Essential info</p>
          </div>
        </div>

        {/* Emergency Numbers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="font-bold text-sm">Emergency Numbers</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {guide.emergency.map((e, i) => {
              const Icon = e.icon;
              return (
                <MotionCard key={i} delay={i * 0.05} className="p-3.5">
                  <a href={`tel:${e.number}`} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{e.label}</p>
                      <p className="text-sm font-extrabold text-primary">{e.number}</p>
                    </div>
                  </a>
                </MotionCard>
              );
            })}
          </div>
        </section>

        {/* Transport Guide */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bus className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm">Transport Guide</h2>
          </div>
          <MotionCard delay={0.1} className="p-4 space-y-3">
            {guide.transport.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{tip}</p>
              </div>
            ))}
          </MotionCard>
        </section>

        {/* Cultural Tips */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-accent" />
            <h2 className="font-bold text-sm">Cultural Tips</h2>
          </div>
          <div className="space-y-2.5">
            {guide.tips.map((tip, i) => (
              <MotionCard key={i} delay={i * 0.05 + 0.15} className="p-4">
                <h3 className="text-sm font-bold mb-1">{tip.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
              </MotionCard>
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
};

export default LocalGuideScreen;
