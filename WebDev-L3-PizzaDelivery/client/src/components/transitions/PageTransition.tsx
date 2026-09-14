import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [displayKey, setDisplayKey] = useState(location.pathname);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (location.pathname === displayKey) return;
    if (prefersReducedMotion) {
      setDisplayKey(location.pathname);
      return;
    }
    setPendingKey(location.pathname);
    setShowLoader(true);
    timerRef.current = setTimeout(() => {
      setDisplayKey(location.pathname);
      setShowLoader(false);
      setPendingKey(null);
    }, 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {showLoader && !prefersReducedMotion && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 9999, background: "rgba(8,11,17,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="overflow-hidden rounded-full"
              style={{
                width: "clamp(280px, 40vw, 480px)",
                height: "clamp(280px, 40vw, 480px)",
                flexShrink: 0,
              }}
            >
              <video
                src="/assets/video/dough-toss.mp4"
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayKey}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
