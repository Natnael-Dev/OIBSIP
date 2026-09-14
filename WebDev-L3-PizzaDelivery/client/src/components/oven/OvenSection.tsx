import { useRef } from "react";
import { motion } from "framer-motion";

export default function OvenSection() {
  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Oven flame */}
          <div className="flex justify-center">
            <motion.div
              className="relative flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05)",
                  "0 0 80px rgba(245,158,11,0.3), 0 0 160px rgba(245,158,11,0.1)",
                  "0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "50%", width: 260, height: 260 }}
            >
              <div
                className="overflow-hidden rounded-full"
                style={{ width: 260, height: 260 }}
              >
                <video
                  src="/assets/video/ember.mp4"
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Amber glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, transparent 45%, rgba(245,158,11,0.08) 65%, transparent 80%)",
                  zIndex: -1,
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Copy */}
          <div>
            <motion.p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: "#F59E0B", fontFamily: "DM Sans, sans-serif" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Process
            </motion.p>
            <motion.h2
              className="font-display mb-6 leading-tight"
              style={{
                fontFamily: "Fraunces, serif",
                color: "#F1F0EE",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              500°C.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                90 seconds.
              </span>
              <br />
              Perfection.
            </motion.h2>
            <motion.p
              className="leading-relaxed mb-8"
              style={{
                color: "rgba(241,240,238,0.6)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1.0625rem",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Every pizza is kissed by a Neapolitan wood-fired dome at 500°C.
              At that temperature, the Maillard reaction runs fast — a char on
              the leopard crust in under 90 seconds, proteins locked, moisture
              sealed, flavour intensified by sheer heat.
            </motion.p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "500°C", label: "Oven temp" },
                { value: "90s", label: "Cook time" },
                { value: "72h", label: "Dough prove" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div
                    className="text-2xl font-semibold mb-1"
                    style={{ color: "#F59E0B", fontFamily: "Fraunces, serif" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "rgba(241,240,238,0.4)", fontFamily: "DM Sans, sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
