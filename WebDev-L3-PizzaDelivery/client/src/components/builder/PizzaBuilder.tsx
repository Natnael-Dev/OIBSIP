import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INGREDIENTS, type Ingredient } from '../../lib/ingredients';
import { useCart } from '../../context/CartContext';
import PizzaCanvas from './PizzaCanvas';

type Category = 'crusts' | 'sauces' | 'cheeses' | 'veggies';

const CATEGORIES: { key: Category; label: string; step: number }[] = [
  { key: 'crusts', label: '1 · Crust', step: 1 },
  { key: 'sauces', label: '2 · Sauce', step: 2 },
  { key: 'cheeses', label: '3 · Cheese', step: 3 },
  { key: 'veggies', label: '4 · Toppings', step: 4 },
];

interface BuildState {
  crust: Ingredient | null;
  sauce: Ingredient | null;
  cheese: Ingredient | null;
  veggies: Ingredient[];
}

function SteamOverlay() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: '40%', zIndex: 50, mixBlendMode: 'screen', opacity: 0.17 }}
    >
      <video
        src="/assets/video/steam-tall.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function PizzaBuilder() {
  const [activeCategory, setActiveCategory] = useState<Category>('crusts');
  const [build, setBuild] = useState<BuildState>({
    crust: INGREDIENTS.crusts[0],
    sauce: null,
    cheese: null,
    veggies: [],
  });
  const { addItem, setIsCartOpen } = useCart();
  const [addedToast, setAddedToast] = useState(false);

  const selectIngredient = (cat: Category, item: Ingredient) => {
    if (cat === 'veggies') {
      setBuild((prev) => {
        const exists = prev.veggies.find((v) => v.id === item.id);
        return {
          ...prev,
          veggies: exists
            ? prev.veggies.filter((v) => v.id !== item.id)
            : [...prev.veggies, item],
        };
      });
    } else {
      const key =
        cat === 'crusts' ? 'crust' : cat === 'sauces' ? 'sauce' : 'cheese';
      setBuild((prev) => ({
        ...prev,
        [key]:
          prev[key as keyof BuildState] &&
          (prev[key as keyof BuildState] as Ingredient)?.id === item.id
            ? null
            : item,
      }));
    }
  };

  const isSelected = (cat: Category, item: Ingredient): boolean => {
    if (cat === 'veggies') return build.veggies.some((v) => v.id === item.id);
    if (cat === 'crusts') return build.crust?.id === item.id;
    if (cat === 'sauces') return build.sauce?.id === item.id;
    return build.cheese?.id === item.id;
  };

  const total =
    12 +
    (build.sauce ? 2 : 0) +
    (build.cheese ? 2.5 : 0) +
    build.veggies.length * 1.5;

  const handleOrder = () => {
    if (!build.crust) return;

    const pizzaName = `Custom ${build.crust.label} Pizza`;
    addItem({
      id: `custom-${Date.now()}`,
      name: pizzaName,
      price: total,
      category: 'Custom Pizza',
      itemType: 'custom',
      customization: {
        base: build.crust.label,
        sauce: build.sauce ? build.sauce.label : 'San Marzano Marinara',
        cheese: build.cheese ? build.cheese.label : 'Fior di Latte Mozzarella',
        veggies: build.veggies.map((v) => v.label),
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
    setIsCartOpen(true);
  };

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <motion.p
            className="type-label mb-4"
            style={{ color: '#F59E0B', fontSize: '11px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Atelier
          </motion.p>
          <motion.h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(2.25rem, 5vw, 3rem)',
              color: '#F8FAFC',
              lineHeight: 1.08,
              marginBottom: '0.75rem',
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.55 }}
          >
            Build Your Pizza
          </motion.h2>
          <p
            className="type-body"
            style={{ color: '#94A3B8', maxWidth: 420, fontSize: '1.0625rem' }}
          >
            Layer by layer, topping by topping — compose something that&apos;s
            yours alone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Pizza canvas */}
          <div className="flex justify-center">
            <div
              className="relative"
              style={{
                width: 'min(100%, 380px)',
                padding: '2rem',
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(248,250,252,0.06)',
                borderRadius: '1.5rem',
              }}
            >
              <SteamOverlay />
              <div className="relative" style={{ zIndex: 10 }}>
                <PizzaCanvas
                  crust={build.crust?.id ?? null}
                  sauce={build.sauce?.id ?? null}
                  cheese={build.cheese?.id ?? null}
                  veggies={build.veggies.map((v) => v.id)}
                  crustLabel={build.crust?.label ?? ''}
                  sauceLabel={build.sauce?.label ?? ''}
                  cheeseLabel={build.cheese?.label ?? ''}
                  veggieTags={build.veggies.map((v) => v.label)}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div>
            {/* Step tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="relative px-5 py-2.5 rounded-full text-sm cursor-pointer"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontWeight: activeCategory === cat.key ? 500 : 400,
                    color:
                      activeCategory === cat.key
                        ? '#080B11'
                        : 'rgba(248,250,252,0.55)',
                    background: 'none',
                    border: '1px solid',
                    borderColor:
                      activeCategory === cat.key
                        ? 'transparent'
                        : 'rgba(248,250,252,0.08)',
                  }}
                >
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="builder-tab"
                      className="absolute inset-0 rounded-full"
                      style={{ background: '#F59E0B' }}
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Ingredient grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {INGREDIENTS[activeCategory].map((item) => {
                  const selected = isSelected(activeCategory, item);
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => selectIngredient(activeCategory, item)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-sm cursor-pointer text-left"
                      style={{
                        background: selected
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(15,23,42,0.8)',
                        border: '1px solid',
                        borderColor: selected
                          ? 'rgba(245,158,11,0.45)'
                          : 'rgba(248,250,252,0.06)',
                        fontFamily: 'Switzer, sans-serif',
                        color: selected ? '#F59E0B' : '#94A3B8',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="text-xs text-center leading-tight">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Order summary */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(248,250,252,0.06)',
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  style={{
                    color: '#64748B',
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: '13px',
                  }}
                >
                  Your build
                </span>
                <motion.span
                  key={total}
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '1.5rem',
                    color: '#F59E0B',
                  }}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  £{total.toFixed(2)}
                </motion.span>
              </div>
              <div
                className="space-y-1 mb-6 text-xs"
                style={{ color: '#475569', fontFamily: 'Switzer, sans-serif' }}
              >
                {build.crust && <div>+ {build.crust.label}</div>}
                {build.sauce && <div>+ {build.sauce.label}</div>}
                {build.cheese && <div>+ {build.cheese.label}</div>}
                {build.veggies.map((v) => (
                  <div key={v.id}>+ {v.label}</div>
                ))}
                {!build.crust && (
                  <div style={{ color: '#334155' }}>Nothing selected yet</div>
                )}
              </div>

              {addedToast && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs text-center"
                  style={{
                    background: 'rgba(16,185,129,0.15)',
                    color: '#10B981',
                    fontFamily: 'Switzer, sans-serif',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  ✓ Custom pizza added to tray! Opening checkout…
                </div>
              )}

              <button
                onClick={handleOrder}
                className="w-full py-3.5 rounded-full text-sm font-semibold cursor-pointer shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
                style={{
                  background: build.crust
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : 'rgba(30,41,59,0.8)',
                  color: build.crust ? '#080B11' : '#475569',
                  fontFamily: 'Switzer, sans-serif',
                  fontWeight: 600,
                  border: 'none',
                  cursor: build.crust ? 'pointer' : 'default',
                }}
                disabled={!build.crust}
              >
                {build.crust
                  ? `Add to Tray — £${total.toFixed(2)}`
                  : 'Select a crust to continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
