import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmbientLayer() {
  const [active, setActive] = useState<"a" | "b">("a");
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = videoARef.current;
    if (!el) return;
    const handleTimeUpdate = () => {
      if (el.duration && el.currentTime >= el.duration - 0.5) {
        const inactive = videoBRef.current;
        if (inactive) {
          inactive.currentTime = 0;
          inactive.play().catch(() => {});
        }
        setActive("b");
        setTimeout(() => {
          el.currentTime = 0;
          el.play().catch(() => {});
        }, 500);
      }
    };
    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, background: "#080B11" }}
      />
    );
  }

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: "screen", opacity: 0.12 }}
    >
      <motion.video
        ref={videoARef}
        src="/assets/video/ember.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        style={videoStyle}
        animate={{ opacity: active === "a" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />
      <motion.video
        ref={videoBRef}
        src="/assets/video/ember.mp4"
        muted
        playsInline
        preload="auto"
        style={videoStyle}
        animate={{ opacity: active === "b" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        initial={{ opacity: 0 }}
      />
    </div>
  );
}
