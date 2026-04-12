import { useCountry, type Country } from "@/lib/CountryContext";
import { AnimatePresence, motion } from "framer-motion";

const watermarkSVGs: Record<Country, string> = {
  singapore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 50 L200 200 Q200 250 180 280 L140 350 Q130 370 150 380 L180 390 Q200 395 220 390 L250 380 Q270 370 260 350 L220 280 Q200 250 200 200 Z M160 200 Q140 180 120 200 Q100 220 120 240 Q140 260 160 240 Q180 220 160 200 Z M240 200 Q260 180 280 200 Q300 220 280 240 Q260 260 240 240 Q220 220 240 200 Z M200 100 Q180 80 160 100 Q140 120 160 140 Q180 160 200 140 Q220 160 240 140 Q260 120 240 100 Q220 80 200 100 Z M180 350 L200 450 L220 350 Z"/></svg>`,
  india: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 30 Q200 30 200 30 L200 80 Q160 100 140 140 L130 180 Q120 220 130 260 L140 300 Q150 340 180 370 L200 400 L220 370 Q250 340 260 300 L270 260 Q280 220 270 180 L260 140 Q240 100 200 80 Z M200 120 A30 30 0 1 1 200 180 A30 30 0 1 1 200 120 Z M160 220 L240 220 L230 260 L170 260 Z M180 280 L220 280 L210 330 L190 330 Z M100 400 L300 400 L300 420 Q250 440 200 450 Q150 440 100 420 Z"/></svg>`,
  dubai: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" fill="currentColor" opacity="0.06"><path d="M195 20 L205 20 L208 200 L215 200 L220 210 L225 200 L230 200 L230 250 L225 250 L220 260 L215 250 L210 250 L212 400 L218 400 L220 410 L225 400 L228 400 L228 450 L225 450 L220 460 L218 450 L212 450 L213 520 L187 520 L188 450 L182 450 L180 460 L175 450 L172 450 L172 400 L175 400 L180 410 L182 400 L188 400 L190 250 L185 250 L180 260 L175 250 L170 250 L170 200 L175 200 L180 210 L185 200 L192 200 Z M160 520 L240 520 L250 540 L150 540 Z"/></svg>`,
  america: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 30 L210 60 L240 60 L215 80 L225 110 L200 90 L175 110 L185 80 L160 60 L190 60 Z M170 120 L230 120 L240 150 L160 150 Z M165 150 L235 150 L235 350 L220 350 L220 250 L210 250 L210 350 L190 350 L190 250 L180 250 L180 350 L165 350 Z M140 350 L260 350 L270 370 L130 370 Z M120 370 L280 370 L280 400 L120 400 Z"/></svg>`,
  japan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 40 Q200 40 200 40 L260 200 Q300 300 340 380 L360 420 L40 420 L60 380 Q100 300 140 200 Z M180 180 Q190 160 200 170 Q210 160 220 180 L240 250 L160 250 Z"/><ellipse cx="200" cy="100" rx="25" ry="25"/></svg>`,
  china: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M100 400 Q120 350 140 380 Q160 350 180 380 Q200 350 220 380 Q240 350 260 380 Q280 350 300 400 L300 420 L100 420 Z M130 380 L130 250 Q130 200 160 180 L160 150 Q150 140 155 130 Q160 120 170 125 L175 120 Q180 100 200 90 Q220 100 225 120 L230 125 Q240 120 245 130 Q250 140 240 150 L240 180 Q270 200 270 250 L270 380 Z M170 250 L170 380 L185 380 L185 250 Z M215 250 L215 380 L230 380 L230 250 Z"/></svg>`,
};

const DynamicBackground = ({ children }: { children: React.ReactNode }) => {
  const { bgImage, country } = useCountry();

  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(watermarkSVGs[country])}`;

  return (
    <div className="relative min-h-screen">
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={country}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Glassmorphism overlay */}
      <div className="fixed inset-0 z-[1] bg-background/80 backdrop-blur-xl" />

      {/* Country watermark */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`watermark-${country}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none"
        >
          <img
            src={svgDataUri}
            alt=""
            className="w-[60vw] max-w-[400px] h-auto text-foreground opacity-[0.04]"
            style={{ filter: "grayscale(1)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};

export default DynamicBackground;
