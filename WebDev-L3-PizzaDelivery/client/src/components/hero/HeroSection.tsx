import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import MagneticButton from "../shared/MagneticButton";
import { useNavigate } from "react-router-dom";

const HEADLINE = [
  { text: "Crafted for", italic: false },
  { text: "those who", italic: false },
  { text: "demand the", italic: false },
  { text: "extraordinary.", italic: true },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<"a" | "b">("a");
  const navigate = useNavigate();

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Spring-smoothed for butter-smooth parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const videoY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = videoARef.current;
    if (!el) return;
    const handleTimeUpdate = () => {
      if (el.duration && el.currentTime >= el.duration - 0.5) {
        const inactive = videoBRef.current;
        if (inactive) { inactive.currentTime = 0; inactive.play().catch(() => {}); }
        setActiveVideo("b");
        setTimeout(() => { el.currentTime = 0; el.play().catch(() => {}); }, 500);
      }
    };
    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
  }, [prefersReducedMotion]);

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ height: "100svh", minHeight: 600 }}
    >
      {/* Video background */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? {} : { y: videoY, scale: videoScale }}
      >
        <motion.video
          ref={videoARef}
          src="/assets/video/hero-orbit.mp4"
          autoPlay muted playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: activeVideo === "a" ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
        <motion.video
          ref={videoBRef}
          src="/assets/video/hero-orbit.mp4"
          muted playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeVideo === "b" ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      {/* Multi-layer gradient scrims for contrast */}
      {/* Base full overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(8,11,17,0.52)" }}
      />
      {/* Radial scrim concentrated behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 52%, rgba(8,11,17,0.72) 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade to obsidian */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(8,11,17,0.55) 0%, transparent 25%, transparent 60%, rgba(8,11,17,1) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          className="type-label mb-6"
          style={{ color: "#F59E0B", fontSize: "11px" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Artisan delivery · Est. 2018
        </motion.p>

        <h1
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            lineHeight: 1.05,
            color: "#F8FAFC",
            marginBottom: "1.5rem",
            textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
          }}
        >
          {HEADLINE.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.text.split(" ").map((word) => {
                const thisIndex = wordIndex++;
                return (
                  <motion.span
                    key={thisIndex}
                    className="inline-block"
                    style={{
                      marginRight: "0.3em",
                      fontStyle: line.italic ? "italic" : "normal",
                    }}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + thisIndex * 0.06, duration: 0.5, ease: "easeOut" }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          style={{
            fontFamily: "Switzer, sans-serif",
            fontSize: "1.0625rem",
            color: "#CBD5E1",
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            lineHeight: 1.65,
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          Fire-kissed dough, single-origin toppings, delivered in 30 minutes or
          the next one&apos;s on us.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <MagneticButton
            onClick={() => navigate("/menu")}
            className="px-8 py-4 rounded-full text-sm font-semibold cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#080B11",
              fontFamily: "Switzer, sans-serif",
              fontWeight: 600,
              border: "none",
            } as React.CSSProperties}
          >
            Explore the Menu
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate("/builder")}
            className="px-8 py-4 rounded-full text-sm font-semibold cursor-pointer"
            style={{
              background: "rgba(248,250,252,0.08)",
              color: "#F8FAFC",
              fontFamily: "Switzer, sans-serif",
              fontWeight: 500,
              border: "1px solid rgba(248,250,252,0.2)",
            } as React.CSSProperties}
          >
            Build Your Own
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        style={{ opacity: 0.45 }}
      >
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(248,250,252,0.5)" strokeWidth="1.5" />
          <motion.rect
            x="8.5" y="6" width="3" height="6" rx="1.5"
            fill="rgba(245,158,11,0.85)"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
