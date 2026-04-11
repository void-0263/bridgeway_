import { useCountry } from "@/lib/CountryContext";
import { AnimatePresence, motion } from "framer-motion";

const DynamicBackground = ({ children }: { children: React.ReactNode }) => {
  const { bgImage, country } = useCountry();

  return (
    <div className="relative min-h-screen">
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={country}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
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

      {/* Content */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};

export default DynamicBackground;
