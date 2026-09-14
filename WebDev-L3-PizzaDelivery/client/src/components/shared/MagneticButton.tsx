import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void | Promise<void>;
  radius?: number;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  radius = 60,
  style: externalStyle,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });
  const scale = useSpring(1, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      const factor = Math.min(12, (12 * (radius - dist)) / radius);
      x.set((dx / dist) * factor);
      y.set((dy / dist) * factor);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!prefersReducedMotion) scale.set(1.03);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, scale, ...externalStyle }}
    >
      {children}
    </motion.button>
  );
}
