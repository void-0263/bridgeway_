import { useCountry, type Country } from "@/lib/CountryContext";
import { AnimatePresence, motion } from "framer-motion";

const watermarkSVGs: Record<Country, string> = {
  singapore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 80 Q200 60 220 50 Q240 40 250 55 Q260 45 270 60 Q275 50 285 65 Q290 55 295 70 L300 90 Q305 100 298 110 L290 120 Q285 130 280 125 L270 135 Q260 145 255 140 L250 150 Q245 155 240 150 L235 145 Q225 155 220 145 L215 150 Q210 155 205 148 L200 155 Q195 148 190 155 L185 148 Q180 155 175 145 L170 150 Q165 155 160 145 L155 140 Q150 145 140 135 L130 125 Q125 130 120 120 L112 110 Q105 100 110 90 L115 70 Q120 55 125 65 Q130 50 140 60 Q150 45 160 55 Q170 40 180 50 Q200 60 200 80 Z M170 180 L200 420 L230 180 Q220 200 200 210 Q180 200 170 180 Z M160 170 Q140 160 130 140 Q125 125 135 115 Q145 110 155 120 Q160 130 160 170 Z M240 170 Q260 160 270 140 Q275 125 265 115 Q255 110 245 120 Q240 130 240 170 Z"/></svg>`,
  india: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 50 A60 60 0 1 1 200 170 A60 60 0 1 1 200 50 Z M200 80 A30 30 0 1 0 200 140 A30 30 0 1 0 200 80 Z M170 95 L200 110 L230 95 M170 125 L200 110 L230 125 M200 80 L200 140 M185 85 L215 135 M215 85 L185 135"/><path d="M120 200 Q140 180 200 170 Q260 180 280 200 L290 220 Q300 240 290 260 L280 270 Q300 290 290 310 L280 320 Q300 340 290 360 L260 380 L260 420 L140 420 L140 380 L110 360 Q100 340 120 320 L110 310 Q100 290 120 270 L110 260 Q100 240 110 220 Z M160 250 Q180 230 200 240 Q220 230 240 250 Q220 270 200 260 Q180 270 160 250 Z M160 320 Q180 300 200 310 Q220 300 240 320 Q220 340 200 330 Q180 340 160 320 Z"/></svg>`,
  dubai: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" fill="currentColor" opacity="0.06"><path d="M195 20 L205 20 L208 200 L215 200 L220 210 L225 200 L230 200 L230 250 L225 250 L220 260 L215 250 L210 250 L212 400 L218 400 L220 410 L225 400 L228 400 L228 450 L225 450 L220 460 L218 450 L212 450 L213 520 L187 520 L188 450 L182 450 L180 460 L175 450 L172 450 L172 400 L175 400 L180 410 L182 400 L188 400 L190 250 L185 250 L180 260 L175 250 L170 250 L170 200 L175 200 L180 210 L185 200 L192 200 Z M160 520 L240 520 L250 540 L150 540 Z"/><path d="M80 380 Q90 350 100 380 Q110 350 120 380 Q130 350 140 380 Q150 350 160 380 L160 540 L80 540 Z M240 380 Q250 350 260 380 Q270 350 280 380 Q290 350 300 380 Q310 350 320 380 L320 540 L240 540 Z"/></svg>`,
  america: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 30 L210 60 L240 60 L215 80 L225 110 L200 90 L175 110 L185 80 L160 60 L190 60 Z M170 120 L230 120 L240 150 L160 150 Z M165 150 L235 150 L235 350 L220 350 L220 250 L210 250 L210 350 L190 350 L190 250 L180 250 L180 350 L165 350 Z M140 350 L260 350 L270 370 L130 370 Z M120 370 L280 370 L280 400 L120 400 Z"/><path d="M60 200 L60 400 L100 400 L100 250 L80 250 L80 200 Z M300 200 L300 400 L340 400 L340 250 L320 250 L320 200 Z"/></svg>`,
  japan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M200 40 Q180 80 150 140 Q120 200 100 280 Q80 360 60 420 L340 420 Q320 360 300 280 Q280 200 250 140 Q220 80 200 40 Z M200 80 Q210 100 225 140 L175 140 Q190 100 200 80 Z M165 170 L235 170 Q255 230 270 300 L130 300 Q145 230 165 170 Z"/><path d="M180 320 L220 320 L225 380 L175 380 Z"/><circle cx="200" cy="150" r="12"/></svg>`,
  china: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="currentColor" opacity="0.06"><path d="M100 400 Q120 350 140 380 Q160 350 180 380 Q200 350 220 380 Q240 350 260 380 Q280 350 300 400 L300 420 L100 420 Z M130 380 L130 250 Q130 200 160 180 L160 150 Q150 140 155 130 Q160 120 170 125 L175 120 Q180 100 200 90 Q220 100 225 120 L230 125 Q240 120 245 130 Q250 140 240 150 L240 180 Q270 200 270 250 L270 380 Z M170 250 L170 380 L185 380 L185 250 Z M215 250 L215 380 L230 380 L230 250 Z"/><path d="M60 300 L90 300 L90 420 L60 420 Z M65 280 L85 260 L85 300 L65 300 Z M310 300 L340 300 L340 420 L310 420 Z M315 280 L335 260 L335 300 L315 300 Z"/></svg>`,
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
