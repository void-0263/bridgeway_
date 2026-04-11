import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const MotionCard = ({ children, className, onClick, delay = 0 }: MotionCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, type: "spring", stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -12px hsl(var(--primary) / 0.2)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn("glass-card rounded-2xl cursor-pointer", className)}
  >
    {children}
  </motion.div>
);

export default MotionCard;
