import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';

const STATUS_STAGES = [
  'received',
  'in_kitchen',
  'sent_to_delivery',
  'delivered',
] as const;

type BackendOrderStatus = (typeof STATUS_STAGES)[number] | 'cancelled';

const STAGE_META: Record<string, { label: string; icon: string; desc: string }> = {
  received: {
    label: 'Order Confirmed',
    icon: '📝',
    desc: 'Your ticket has been sent to our stone hearth station.',
  },
  in_kitchen: {
    label: 'Artisanal Baking',
    icon: '🔥',
    desc: 'Fired at 450°C in our volcanic stone oven.',
  },
  sent_to_delivery: {
    label: 'Out for Delivery',
    icon: '🛵',
    desc: 'Secured in thermal insulated box, courier is en route.',
  },
  delivered: {
    label: 'Delivered',
    icon: '🎉',
    desc: 'Handed over at your doorstep. Buon appetito!',
  },
};

const ALL_STAGES = [
  { id: 'received', label: 'Order Confirmed' },
  { id: 'in_kitchen', label: 'In Kitchen (Baking)' },
  { id: 'sent_to_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOrderNumber = searchParams.get('orderNumber') || searchParams.get('orderId') || '';

  const [searchQuery, setSearchQuery] = useState(urlOrderNumber);
  const [activeOrderNumber, setActiveOrderNumber] = useState(urlOrderNumber || 'CC-DEMO');
  const [currentStatus, setCurrentStatus] = useState<BackendOrderStatus>('received');
  const [orderDetails, setOrderDetails] = useState<{
    items?: Array<{ name: string; quantity: number; unitPrice: number }>;
    totalAmount?: number;
    customerDetails?: { deliveryAddress?: string; name?: string };
    createdAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch order data when activeOrderNumber changes
  useEffect(() => {
    if (!activeOrderNumber || activeOrderNumber === 'CC-DEMO') {
      // Demo simulation
      setCurrentStatus('received');
      setOrderDetails({
        items: [{ name: 'Custom Hand-Tossed Truffle Pizza', quantity: 1, unitPrice: 24.5 }],
        totalAmount: 28.5,
        customerDetails: {
          name: 'Demo Gourmet',
          deliveryAddress: '12 Kensington High St, London',
        },
        createdAt: new Date().toISOString(),
      });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    api
      .get<{
        success: boolean;
        data: {
          orderNumber: string;
          orderStatus: BackendOrderStatus;
          items: Array<{ name: string; quantity: number; unitPrice: number }>;
          totalAmount: number;
          customerDetails: { deliveryAddress: string; name: string };
          createdAt: string;
        };
      }>(`/api/orders/track/${activeOrderNumber}`)
      .then((res) => {
        if (res.data) {
          setCurrentStatus(res.data.orderStatus);
          setOrderDetails(res.data);
        }
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : 'Order not found');
      })
      .finally(() => setLoading(false));
  }, [activeOrderNumber]);

  // Real-Time Socket.io Connection
  useEffect(() => {
    if (!activeOrderNumber || activeOrderNumber === 'CC-DEMO') return;

    const socket = getSocket();

    // Join room for this specific order
    socket.emit('join_order_room', activeOrderNumber);

    const onStatusUpdate = (payload: { orderNumber: string; status: BackendOrderStatus }) => {
      console.log('[Tracking] Live status update received:', payload);
      if (payload.orderNumber === activeOrderNumber) {
        setCurrentStatus(payload.status);
      }
    };

    socket.on('order:status_updated', onStatusUpdate);

    return () => {
      socket.off('order:status_updated', onStatusUpdate);
    };
  }, [activeOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanNum = searchQuery.trim().toUpperCase();
    setActiveOrderNumber(cleanNum);
    setSearchParams({ orderNumber: cleanNum });
  };

  const currentIdx = STATUS_STAGES.indexOf(currentStatus as (typeof STATUS_STAGES)[number]);

  return (
    <div
      className="min-h-screen relative z-10 pt-24 pb-16 px-6 font-sans text-slate-100"
      style={{ background: '#080B11' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Order Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Order # (e.g. CC-12345)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md"
          >
            Track Order
          </button>
        </form>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMsg} — Try entering an active order number from the admin cockpit.
          </div>
        )}

        {/* Header Information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase font-semibold">
              Live Tracker · {activeOrderNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Socket.io Live
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '2.5rem',
              color: '#F8FAFC',
              lineHeight: 1.1,
              marginTop: '0.5rem',
            }}
          >
            {currentStatus === 'delivered'
              ? 'Enjoy Your Meal!'
              : STAGE_META[currentStatus]?.label || 'Preparing Order'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {STAGE_META[currentStatus]?.desc || 'Fulfilling your artisanal selection with speed and care.'}
          </p>
        </motion.div>

        {/* Courier Animated Visual */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-10 border border-white/10 flex items-center justify-center relative shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(8,11,17,0.9))',
            padding: '1.5rem',
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <video
            src="/assets/video/courier-scooter.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            style={{
              width: 'min(100%, 360px)',
              height: 'auto',
              borderRadius: '1rem',
            }}
          />
        </motion.div>

        {/* 4-Stage Live Status Stepper */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 mb-8 shadow-xl">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-6">
            Fulfillment Journey
          </h3>

          <div className="space-y-6">
            {ALL_STAGES.map((stage, i) => {
              const active = i === currentIdx;
              const done = i < currentIdx;
              return (
                <div key={stage.id} className="flex items-start gap-4 relative">
                  {/* Vertical Connector Line */}
                  {i < ALL_STAGES.length - 1 && (
                    <div
                      className="absolute left-4 top-8 w-0.5 h-10 -ml-[1px] transition-all duration-500"
                      style={{
                        background: done
                          ? '#10B981'
                          : active
                          ? 'linear-gradient(to bottom, #F59E0B, rgba(255,255,255,0.1))'
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  )}

                  {/* Stage Node Icon */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md flex-shrink-0 relative z-10"
                    style={{
                      background: done
                        ? '#10B981'
                        : active
                        ? '#F59E0B'
                        : 'rgba(30,41,59,0.8)',
                      color: done || active ? '#080B11' : '#64748B',
                      border: active ? '2px solid rgba(245,158,11,0.5)' : 'none',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </div>

                  {/* Stage Text */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-semibold transition-colors"
                        style={{
                          color: done
                            ? '#10B981'
                            : active
                            ? '#F59E0B'
                            : 'rgba(248,250,252,0.4)',
                        }}
                      >
                        {stage.label}
                      </span>
                      {active && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Active Stage
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {STAGE_META[stage.id]?.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Order Summary */}
        {orderDetails && (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
            <h4
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '1.25rem',
                color: '#F8FAFC',
              }}
            >
              Order Details
            </h4>

            <div className="divide-y divide-white/5 text-xs text-slate-300 space-y-2">
              {orderDetails.items?.map((item, idx) => (
                <div key={idx} className="pt-2 flex justify-between">
                  <span>
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-mono text-white">
                    £{((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {orderDetails.customerDetails?.deliveryAddress && (
              <div className="pt-2 border-t border-white/5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Delivery Address: </span>
                {orderDetails.customerDetails.deliveryAddress}
              </div>
            )}

            {orderDetails.totalAmount != null && (
              <div className="pt-2 border-t border-white/5 flex justify-between font-semibold text-sm text-white">
                <span>Total Paid (Razorpay Test Mode)</span>
                <span className="font-mono text-amber-500">
                  £{orderDetails.totalAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
