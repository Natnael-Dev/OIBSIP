import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

type FilterKey = "all" | "vegetarian" | "spicy" | "new";

interface PizzaCard {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  video: string;
  accentColor: string;
  bgGradient: string;
  tags: FilterKey[];
  videoScale: number;
}

const PIZZAS: PizzaCard[] = [
  {
    id: "margherita",
    name: "Margherita Royale",
    subtitle: "San Marzano · Fior di Latte · Basil",
    price: "£18",
    video: "/assets/video/card-margherita.mp4",
    accentColor: "#F59E0B",
    bgGradient: "radial-gradient(ellipse at 50% 65%, rgba(245,158,11,0.28) 0%, rgba(180,83,9,0.12) 45%, rgba(8,11,17,0) 75%)",
    tags: ["all", "vegetarian", "new"],
    videoScale: 1.0,
  },
  {
    id: "truffle",
    name: "Truffle & Wild Funghi",
    subtitle: "Black Truffle · Porcini · Taleggio",
    price: "£26",
    video: "/assets/video/card-truffle.mp4",
    accentColor: "#D97706",
    bgGradient: "radial-gradient(ellipse at 50% 65%, rgba(217,119,6,0.3) 0%, rgba(120,53,15,0.14) 45%, rgba(8,11,17,0) 75%)",
    tags: ["all", "vegetarian", "new"],
    videoScale: 1.08,
  },
  {
    id: "diavola",
    name: "Diavola Piccante",
    subtitle: "Nduja · Calabrian Chili · Smoked Scamorza",
    price: "£22",
    video: "/assets/video/card-diavola.mp4",
    accentColor: "#EF4444",
    bgGradient: "radial-gradient(ellipse at 50% 65%, rgba(239,68,68,0.28) 0%, rgba(180,0,0,0.1) 45%, rgba(8,11,17,0) 75%)",
    tags: ["all", "spicy"],
    videoScale: 1.08,
  },
  {
    id: "verde",
    name: "Verde Pesto Harvest",
    subtitle: "Genovese Pesto · Burrata · Courgette",
    price: "£20",
    video: "/assets/video/card-verde.mp4",
    accentColor: "#10B981",
    bgGradient: "radial-gradient(ellipse at 50% 65%, rgba(16,185,129,0.25) 0%, rgba(5,100,60,0.1) 45%, rgba(8,11,17,0) 75%)",
    tags: ["all", "vegetarian"],
    videoScale: 1.0,
  },
];

const EXTRAS = [
  { id: "garlic-bread", name: "Wood-Fired Garlic Bread", price: "£6", category: "Sides", accentColor: "#D97706" },
  { id: "burrata-salad", name: "Burrata & Heritage Tomato", price: "£12", category: "Starters", accentColor: "#10B981" },
  { id: "tiramisu", name: "Artisan Tiramisu", price: "£8", category: "Desserts", accentColor: "#A78BFA" },
  { id: "lemonade", name: "Sicilian Lemonade", price: "£4.50", category: "Drinks", accentColor: "#F59E0B" },
  { id: "nduja-arancini", name: "Nduja Arancini ×3", price: "£9", category: "Starters", accentColor: "#EF4444" },
  { id: "panna-cotta", name: "Vanilla Panna Cotta", price: "£7", category: "Desserts", accentColor: "#CBD5E1" },
  { id: "sparkling-water", name: "Acqua Panna 750ml", price: "£3", category: "Drinks", accentColor: "#06B6D4" },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "spicy", label: "Spicy" },
  { key: "new", label: "New" },
];

function PizzaCardItem({ pizza }: { pizza: PizzaCard }) {
  const [hovered, setHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lazy load when in viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVideoLoaded(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pause offscreen video
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause();
    }, { threshold: 0 });
    obs.observe(card);
    return () => obs.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setHovered(true);
    const v = videoRef.current;
    if (v && videoLoaded) { v.currentTime = 0; v.play().catch(() => {}); }
  };
  const handleMouseLeave = () => {
    setHovered(false);
    videoRef.current?.pause();
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none"
      style={{ aspectRatio: "9/16", background: "#0F172A" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate("/menu/" + pizza.id)}
      animate={hovered
        ? { y: -10, boxShadow: `0 28px 80px ${pizza.accentColor}44, 0 8px 24px ${pizza.accentColor}22` }
        : { y: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Always-visible gradient poster */}
      <motion.div
        className="absolute inset-0"
        style={{ background: pizza.bgGradient }}
        animate={!prefersReducedMotion && !hovered
          ? { scale: [1, 1.03, 1] }
          : { scale: 1 }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pizza icon always visible */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: "20%" }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill={pizza.accentColor} opacity="0.18" />
            <circle cx="90" cy="90" r="66" fill={pizza.accentColor} opacity="0.14" />
            <circle cx="90" cy="90" r="52" fill={pizza.accentColor} opacity="0.12" />
            <circle cx="62" cy="72" r="9" fill={pizza.accentColor} opacity="0.45" />
            <circle cx="110" cy="68" r="7" fill={pizza.accentColor} opacity="0.4" />
            <circle cx="98" cy="104" r="10" fill={pizza.accentColor} opacity="0.4" />
            <circle cx="72" cy="106" r="7" fill={pizza.accentColor} opacity="0.35" />
          </svg>
        </motion.div>
      </div>

      {/* Video layer */}
      {videoLoaded && (
        <motion.video
          ref={videoRef}
          src={pizza.video}
          muted playsInline loop preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: pizza.videoScale }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
      )}

      {/* Bottom gradient scrim — always present */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(8,11,17,0.96) 0%, rgba(8,11,17,0.55) 30%, transparent 65%)",
        }}
      />

      {/* Info — always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.p
          className="type-label mb-1.5"
          style={{ color: pizza.accentColor, fontSize: "10px" }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.25 }}
        >
          {pizza.subtitle}
        </motion.p>
        <h3
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "1.2rem",
            color: "#F8FAFC",
            lineHeight: 1.15,
            marginBottom: "0.5rem",
          }}
        >
          {pizza.name}
        </h3>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "1.35rem", color: pizza.accentColor }}>
            {pizza.price}
          </span>
          <motion.button
            className="px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: pizza.accentColor,
              color: "#080B11",
              fontFamily: "Switzer, sans-serif",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ opacity: hovered ? 1 : 0.85, scale: hovered ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              const priceVal = parseFloat(pizza.price.replace(/[^0-9.]/g, '')) || 18;
              addItem({
                id: pizza.id,
                name: pizza.name,
                price: priceVal,
                category: 'Signature Pizza',
                itemType: 'preset',
                customization: {
                  base: 'Classic Hand-Tossed',
                  sauce: 'San Marzano Marinara',
                  cheese: 'Fior di Latte Mozzarella',
                  veggies: ['Sweet Bell Peppers'],
                },
              });
              setIsCartOpen(true);
            }}
          >
            + Add to Tray
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function FilterTabs({ active, onChange }: { active: FilterKey; onChange: (k: FilterKey) => void }) {
  return (
    <div className="flex gap-2 flex-wrap mb-10">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className="relative px-5 py-2 rounded-full text-sm"
          style={{
            fontFamily: "Switzer, sans-serif",
            fontWeight: active === f.key ? 500 : 400,
            color: active === f.key ? "#080B11" : "rgba(248,250,252,0.55)",
            background: "none",
            border: "1px solid",
            borderColor: active === f.key ? "transparent" : "rgba(248,250,252,0.1)",
            cursor: "pointer",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          {active === f.key && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 rounded-full"
              style={{ background: "#F59E0B" }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1 }}>{f.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function MenuGrid() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsCartOpen } = useCart();

  const filtered = filter === "all" ? PIZZAS : PIZZAS.filter((p) => p.tags.includes(filter));

  const scrollCarousel = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <motion.p
            className="type-label mb-4"
            style={{ color: "#F59E0B", fontSize: "11px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Signature Collection
          </motion.p>
          <motion.h2
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(2.25rem, 5vw, 3rem)",
              color: "#F8FAFC",
              lineHeight: 1.08,
              marginBottom: "1rem",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.55 }}
          >
            The Menu
          </motion.h2>
          <motion.p
            className="type-body max-w-md"
            style={{ color: "#94A3B8", fontSize: "1.0625rem" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
          >
            Each pizza is sourced, proved, and fired with single-minded purpose. Choose from our signatures or build your own.
          </motion.p>
        </div>

        <FilterTabs active={filter} onChange={setFilter} />

        {/* 4-card grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((pizza, i) => (
              <motion.div
                key={pizza.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <PizzaCardItem pizza={pizza} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <motion.p
                className="col-span-4 text-center py-16"
                style={{ color: "#475569", fontFamily: "Switzer, sans-serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No pizzas in this category yet.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Horizontal extras carousel */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "1.5rem",
                color: "#F8FAFC",
              }}
            >
              Sides, Starters &amp; More
            </h3>
            <div className="flex gap-2">
              {["left", "right"].map((dir) => (
                <button
                  key={dir}
                  onClick={() => scrollCarousel(dir as "left" | "right")}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(248,250,252,0.08)",
                    cursor: "pointer",
                    color: "#F8FAFC",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d={dir === "left" ? "M9 11L5 7L9 3" : "M5 3L9 7L5 11"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {EXTRAS.map((item) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 rounded-xl p-5 cursor-pointer select-none relative group"
                style={{
                  width: 200,
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(248,250,252,0.06)",
                  borderTop: `2px solid ${item.accentColor}55`,
                }}
                whileHover={{ y: -4, borderTopColor: item.accentColor }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 5;
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: priceNum,
                    category: item.category,
                    itemType: 'preset',
                  });
                  setIsCartOpen(true);
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className="type-label block"
                    style={{ color: item.accentColor, fontSize: "9px" }}
                  >
                    {item.category}
                  </span>
                  <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    + Add
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontSize: "1rem",
                    color: "#F8FAFC",
                    lineHeight: 1.2,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.name}
                </p>
                <span
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontSize: "1.1rem",
                    color: item.accentColor,
                  }}
                >
                  {item.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
