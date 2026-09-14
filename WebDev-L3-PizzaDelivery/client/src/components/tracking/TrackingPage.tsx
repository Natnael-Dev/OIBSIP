import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';

const STATUS_STAGES = [
  'received',
  'kitchen',
  'delivery',
  'delivered',
] as const;

type OrderStatus = (typeof STATUS_STAGES)[number];

const STAGE_META: Record<OrderStatus, { label: string; icon: string }> = {
  received: { label: 'Order confirmed', icon: '✓' },
  kitchen: { label: 'Being prepared', icon: '🔥' },
  delivery: { label: 'Out for delivery', icon: '🛵' },
  delivered: { label: 'Delivered', icon: '🎉' },
};

const ALL_STAGES: { id: OrderStatus; label: string }[] = [
  { id: 'received', label: 'Order confirmed' },
  { id: 'kitchen', label: 'Being prepared' },
  { id: 'delivery', label: 'Out for delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('received');
  const [orderRef, setOrderRef] = useState('');
  const [orderDesc, setOrderDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Load initial order state
  useEffect(() => {
    if (!orderId) {
      // Demo mode — simulate progress
      setLoading(false);
      setOrderRef('DEMO');
      setOrderDesc('Demo Pizza');
      const t = setInterval(() => {
        setCurrentStatus((s) => {
          const idx = STATUS_STAGES.indexOf(s);
          if (idx >= STATUS_STAGES.length - 1) {
            clearInterval(t);
            return s;
          }
          return STATUS_STAGES[idx + 1];
        });
      }, 4000);
      return () => clearInterval(t);
    }

    api
      .get<{
        order: {
          _id: string;
          status: string;
          items: Array<{ pizza?: { name?: string }; quantity?: number }>;
        };
      }>(`/api/orders/${orderId}`)
      .then(({ order }) => {
        setCurrentStatus((order.status as OrderStatus) ?? 'received');
        setOrderRef(order._id.slice(-6).toUpperCase());
        setOrderDesc(
          order.items
            .map(
              (i) =>
                `${i.pizza?.name ?? 'Custom Pizza'} ×${i.quantity ?? 1}`,
            )
            .join(', '),
        );
      })
      .catch(() => {
        setOrderRef(orderId.slice(-6).toUpperCase());
        setOrderDesc('Your pizza');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  // WebSocket live updates
  useEffect(() => {
    if (!orderId) return;

    const WS_URL = (
      import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
    ).replace(/^http/, 'ws') + '/ws';

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as {
            type: string;
            orderId?: string;
            status?: string;
          };
          if (
            msg.type === 'order:status' &&
            (msg.orderId === orderId || msg.orderId === orderId.slice(-6).toUpperCase())
          ) {
            setCurrentStatus(msg.status as OrderStatus);
          }
        } catch {
          /* ignore */
        }
      };

      return () => ws.close();
    } catch {
      return () => {};
    }
  }, [orderId]);

  const currentIdx = STATUS_STAGES.indexOf(currentStatus);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#080B11' }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            color: '#475569',
            fontFamily: 'Switzer, sans-serif',
            fontSize: '0.875rem',
          }}
        >
          Loading order…
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative z-10 pt-24 pb-16 px-6"
      style={{ background: '#080B11' }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: '#F59E0B', fontFamily: 'Switzer, sans-serif' }}
          >
            Order #{orderRef}
          </p>
          <h1
            style={{
              fontFamily: 'Instrument Serif, serif',
              color: '#F8FAFC',
              fontSize: '2.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {currentStatus === 'delivered' ? 'Enjoy your pizza!' : 'On its way.'}
          </h1>
          <p
            className="mb-12"
            style={{
              color: 'rgba(248,250,252,0.5)',
              fontFamily: 'Switzer, sans-serif',
            }}
          >
            {orderDesc}
            {currentStatus !== 'delivered' && ' · ETA ~18 minutes'}
          </p>
        </motion.div>

        {/* Courier animation */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-10 flex items-center justify-center"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(248,250,252,0.06)',
            padding: '2rem',
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <video
            src="/assets/video/courier-scooter.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            style={{
              width: 'min(100%, 400px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Status timeline */}
        <div className="space-y-0">
          {ALL_STAGES.map((stage, i) => {
            const active = i === currentIdx;
            const done = i < currentIdx;
            return (
              <motion.div
                key={stage.id}
                className="flex items-start gap-4 relative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                {/* Timeline connector */}
                {i < ALL_STAGES.length - 1 && (
                  <div
                    className="absolute left-[11px] top-7 w-px"
                    style={{
                      height: 'calc(100% - 4px)',
                      background: done
                        ? 'rgba(245,158,11,0.5)'
                        : 'rgba(248,250,252,0.08)',
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="relative flex-shrink-0 mt-1"
                  style={{ width: 24 }}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: done
                        ? '#F59E0B'
                        : active
                          ? 'rgba(245,158,11,0.2)'
                          : 'rgba(30,41,59,0.8)',
                      border: `1px solid ${
                        done
                          ? '#F59E0B'
                          : active
                            ? 'rgba(245,158,11,0.6)'
                            : 'rgba(248,250,252,0.1)'
                      }`,
                    }}
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {done && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="#080B11"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {active && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#F59E0B' }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Label */}
                <div className="pb-8">
                  <div
                    className="text-sm font-medium mb-0.5"
                    style={{
                      fontFamily: 'Switzer, sans-serif',
                      color:
                        done || active
                          ? '#F8FAFC'
                          : 'rgba(248,250,252,0.35)',
                    }}
                  >
                    {stage.label}
                  </div>
                  {(done || active) && (
                    <div
                      className="text-xs"
                      style={{
                        color: 'rgba(248,250,252,0.3)',
                        fontFamily: 'Switzer, sans-serif',
                      }}
                    >
                      {active ? 'In progress…' : 'Completed'}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
