import { motion, AnimatePresence } from "framer-motion";

interface CanvasProps {
  crust: string | null;
  sauce: string | null;
  cheese: string | null;
  veggies: string[];
  crustLabel: string;
  sauceLabel: string;
  cheeseLabel: string;
  veggieTags: string[];
}

const SCATTER: Record<string, { cx: number; cy: number; r: number }[]> = {
  peppers: [
    { cx: 120, cy: 105, r: 9 }, { cx: 165, cy: 140, r: 7 },
    { cx: 105, cy: 160, r: 8 }, { cx: 150, cy: 85, r: 7 },
    { cx: 90, cy: 130, r: 6 }, { cx: 175, cy: 165, r: 8 },
  ],
  onions: [
    { cx: 130, cy: 110, r: 10 }, { cx: 170, cy: 150, r: 8 },
    { cx: 100, cy: 155, r: 9 }, { cx: 155, cy: 90, r: 8 },
    { cx: 85, cy: 125, r: 7 },
  ],
  olives: [
    { cx: 125, cy: 120, r: 11 }, { cx: 165, cy: 145, r: 10 },
    { cx: 108, cy: 160, r: 11 }, { cx: 152, cy: 95, r: 10 },
    { cx: 88, cy: 140, r: 9 }, { cx: 172, cy: 172, r: 10 },
  ],
  jalapenos: [
    { cx: 118, cy: 108, r: 7 }, { cx: 160, cy: 148, r: 7 },
    { cx: 102, cy: 162, r: 6 }, { cx: 148, cy: 88, r: 7 },
    { cx: 80, cy: 130, r: 6 },
  ],
  mushrooms: [
    { cx: 130, cy: 115, r: 13 }, { cx: 168, cy: 152, r: 11 },
    { cx: 105, cy: 158, r: 12 }, { cx: 155, cy: 92, r: 11 },
    { cx: 87, cy: 138, r: 10 },
  ],
  tomatoes: [
    { cx: 122, cy: 112, r: 10 }, { cx: 162, cy: 145, r: 9 },
    { cx: 100, cy: 160, r: 10 }, { cx: 150, cy: 88, r: 9 },
    { cx: 178, cy: 168, r: 8 }, { cx: 84, cy: 132, r: 9 },
  ],
};

const CRUST_COLORS: Record<string, string> = {
  "hand-tossed": "#B45309",
  "thin-crust": "#D97706",
  sourdough: "#92400E",
  "gluten-free": "#A16207",
  "stuffed-crust": "#B45309",
};

const SAUCE_COLORS: Record<string, string> = {
  marinara: "#EF4444",
  arrabiata: "#DC2626",
  alfredo: "#FEF3C7",
  bbq: "#78350F",
  pesto: "#10B981",
};

const CHEESE_FILLS: Record<string, string> = {
  mozzarella: "#FEF9C3",
  cheddar: "#F59E0B",
  gouda: "#FBBF24",
  ricotta: "#FFF7ED",
  vegan: "#D1FAE5",
};

const VEGGIE_COLORS: Record<string, string> = {
  peppers: "#EF4444",
  onions: "#A78BFA",
  olives: "#292524",
  jalapenos: "#16A34A",
  mushrooms: "#A8A29E",
  tomatoes: "#F87171",
};

const SPRING = { type: "spring" as const, stiffness: 200, damping: 22 };

const SIZE = 280;
const C = SIZE / 2;
const R_OUTER = C - 16;
const R_INNER = R_OUTER * 0.82;

export default function PizzaCanvas({
  crust, sauce, cheese, veggies,
  crustLabel, sauceLabel, cheeseLabel, veggieTags,
}: CanvasProps) {
  const crustColor = crust ? (CRUST_COLORS[crust] ?? "#B45309") : null;
  const sauceColor = sauce ? (SAUCE_COLORS[sauce] ?? "#EF4444") : null;
  const cheeseColor = cheese ? (CHEESE_FILLS[cheese] ?? "#FEF9C3") : null;

  const label = [
    crust ? crustLabel : null,
    sauce ? sauceLabel : null,
    cheese ? cheeseLabel : null,
    ...veggieTags,
  ].filter(Boolean).join(" · ");

  const cheeseBlobs = [
    { cx: C, cy: C, r: R_INNER * 0.55 },
    { cx: C - 35, cy: C - 28, r: R_INNER * 0.28 },
    { cx: C + 38, cy: C - 22, r: R_INNER * 0.25 },
    { cx: C + 28, cy: C + 35, r: R_INNER * 0.26 },
    { cx: C - 32, cy: C + 30, r: R_INNER * 0.24 },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: "visible" }}
      >
        {/* Empty state ring */}
        {!crust && (
          <circle
            cx={C} cy={C} r={R_OUTER}
            fill="none"
            stroke="rgba(245,158,11,0.2)"
            strokeWidth="2"
            strokeDasharray="8 5"
          />
        )}

        {/* Crust */}
        <AnimatePresence>
          {crustColor && (
            <motion.circle
              key={"crust-" + crust}
              cx={C} cy={C} r={R_OUTER}
              fill={crustColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING}
              style={{ transformOrigin: `${C}px ${C}px` }}
            />
          )}
        </AnimatePresence>

        {/* Dough center (lighter) */}
        <AnimatePresence>
          {crustColor && (
            <motion.circle
              key={"dough-" + crust}
              cx={C} cy={C} r={R_INNER}
              fill={crustColor}
              style={{ filter: "brightness(1.3)", transformOrigin: `${C}px ${C}px` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ ...SPRING, delay: 0.04 }}
            />
          )}
        </AnimatePresence>

        {/* Sauce */}
        <AnimatePresence>
          {sauceColor && crustColor && (
            <motion.circle
              key={"sauce-" + sauce}
              cx={C} cy={C} r={R_INNER * 0.96}
              fill={sauceColor}
              opacity={0.88}
              style={{ transformOrigin: `${C}px ${C}px` }}
              initial={{ scale: 0, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 0.88, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING}
            />
          )}
        </AnimatePresence>

        {/* Cheese blobs */}
        <AnimatePresence>
          {cheeseColor && crustColor && cheeseBlobs.map((blob, i) => (
            <motion.circle
              key={"cheese-" + cheese + "-" + i}
              cx={blob.cx} cy={blob.cy} r={blob.r}
              fill={cheeseColor}
              opacity={0.88}
              style={{ transformOrigin: `${blob.cx}px ${blob.cy}px` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.88 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ ...SPRING, delay: i * 0.04 }}
            />
          ))}
        </AnimatePresence>

        {/* Toppings */}
        <AnimatePresence>
          {veggies.map((v) => {
            const color = VEGGIE_COLORS[v] ?? "#94A3B8";
            const spots = SCATTER[v] ?? [];
            return spots.map((spot, i) => (
              <motion.circle
                key={"v-" + v + "-" + i}
                cx={spot.cx} cy={spot.cy} r={spot.r}
                fill={color}
                opacity={0.92}
                style={{ transformOrigin: `${spot.cx}px ${spot.cy}px` }}
                initial={{ scale: 0, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 0.92, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ ...SPRING, delay: i * 0.03 }}
              />
            ));
          })}
        </AnimatePresence>
      </svg>

      <motion.p
        style={{
          fontFamily: "Switzer, sans-serif",
          fontSize: "0.75rem",
          color: label ? "#94A3B8" : "rgba(148,163,184,0.3)",
          textAlign: "center",
          maxWidth: 260,
          lineHeight: 1.5,
          minHeight: "2em",
        }}
        animate={{ opacity: label ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      >
        {label || "Select a crust to begin"}
      </motion.p>
    </div>
  );
}
