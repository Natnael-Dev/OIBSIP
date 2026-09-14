import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type OrderStatus = 'received' | 'kitchen' | 'delivery' | 'delivered';

interface InventoryRow {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  category: string;
}

interface InventoryGroup {
  [category: string]: InventoryRow[];
}

interface Order {
  id: string;
  customer: string;
  items: string;
  time: string;
  status: OrderStatus;
}

interface AlertEntry {
  time: string;
  item: string;
  current: number;
  threshold: number;
}

const STATUS_ORDER: OrderStatus[] = [
  'received',
  'kitchen',
  'delivery',
  'delivered',
];
const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Received',
  kitchen: 'In Kitchen',
  delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

function stockColor(stock: number, threshold: number) {
  const ratio = stock / threshold;
  if (ratio <= 0.5) return '#EF4444';
  if (ratio <= 1.0) return '#F59E0B';
  return '#10B981';
}

// ─── Inventory Section ────────────────────────────────────────────────────────
function InventorySection() {
  const [inventory, setInventory] = useState<InventoryGroup>({});
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ items: InventoryRow[] }>('/api/inventory')
      .then(({ items }) => {
        const grouped: InventoryGroup = {};
        for (const item of items) {
          const cat = item.category ?? 'Other';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(item);
        }
        setInventory(grouped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const restock = async (category: string, id: string, amount: number) => {
    try {
      await api.post(`/api/inventory/restock/${id}`, { amount });
      setInventory((prev) => ({
        ...prev,
        [category]: prev[category].map((row) =>
          row.id === id ? { ...row, stock: row.stock + amount } : row,
        ),
      }));
      const flashKey = `${category}-${id}`;
      setFlashIds((prev) => new Set(prev).add(flashKey));
      setTimeout(() => {
        setFlashIds((prev) => {
          const next = new Set(prev);
          next.delete(flashKey);
          return next;
        });
      }, 600);
    } catch (err) {
      console.error('Restock failed:', err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          color: '#475569',
          fontFamily: 'Switzer, sans-serif',
          fontSize: '0.875rem',
        }}
      >
        Loading inventory…
      </div>
    );
  }

  return (
    <div>
      <h2
        className="mb-6"
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: '1.25rem',
          color: '#F8FAFC',
        }}
      >
        Inventory
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(inventory).map(([category, rows]) => (
          <div
            key={category}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(248,250,252,0.06)' }}
          >
            <div
              className="px-4 py-2.5"
              style={{
                background: 'rgba(15,23,42,0.8)',
                borderBottom: '1px solid rgba(248,250,252,0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: 'Switzer, sans-serif',
                  fontSize: '0.7rem',
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {rows.map((row) => {
                  const color = stockColor(row.stock, row.threshold);
                  const flashKey = `${category}-${row.id}`;
                  const flashing = flashIds.has(flashKey);
                  return (
                    <motion.tr
                      key={row.id}
                      animate={{
                        background: flashing
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(8,11,17,0)',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        borderBottom: '1px solid rgba(248,250,252,0.04)',
                      }}
                    >
                      <td
                        style={{
                          padding: '0.5rem 1rem',
                          fontFamily: 'Switzer, sans-serif',
                          fontSize: '0.8125rem',
                          color: '#CBD5E1',
                        }}
                      >
                        {row.name}
                      </td>
                      <td
                        style={{
                          padding: '0.5rem 0.5rem',
                          fontFamily: 'Switzer, sans-serif',
                          fontSize: '0.875rem',
                          fontVariantNumeric: 'tabular-nums',
                          color,
                          fontWeight: 500,
                          width: 48,
                          textAlign: 'right',
                        }}
                      >
                        {row.stock}
                      </td>
                      <td style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
                        <div className="flex gap-1 justify-end">
                          {[20, 50].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => restock(category, row.id, amt)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '0.375rem',
                                background: 'rgba(30,41,59,0.8)',
                                border: '1px solid rgba(248,250,252,0.08)',
                                color: '#94A3B8',
                                fontFamily: 'Switzer, sans-serif',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                              }}
                            >
                              +{amt}
                            </button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Order Queue ──────────────────────────────────────────────────────────────
function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Initial load
  useEffect(() => {
    type RawOrder = {
      _id: string;
      customer?: { name?: string; email?: string };
      items: Array<{ pizza?: { name?: string }; quantity?: number }>;
      createdAt: string;
      status: string;
    };
    api
      .get<{ orders: RawOrder[] }>('/api/orders')
      .then(({ orders: raw }) => {
        setOrders(
          raw.map((o) => ({
            id: o._id.slice(-6).toUpperCase(),
            _id: o._id,
            customer: o.customer?.name ?? o.customer?.email ?? 'Guest',
            items: o.items
              .map(
                (i) => `${i.pizza?.name ?? 'Custom Pizza'} ×${i.quantity ?? 1}`,
              )
              .join(', '),
            time: new Date(o.createdAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: (o.status as OrderStatus) ?? 'received',
          })),
        );
      })
      .catch(console.error);
  }, []);


  // WebSocket live updates
  useEffect(() => {
    const WS_URL =
      (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(
        /^http/,
        'ws',
      ) + '/ws';
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
          if (msg.type === 'order:status' && msg.orderId && msg.status) {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === msg.orderId || (o as Order & { _id?: string })._id === msg.orderId
                  ? { ...o, status: msg.status as OrderStatus }
                  : o,
              ),
            );
          }
        } catch {
          /* ignore */
        }
      };

      ws.onerror = () => {
        /* silent — server may not have native WS */
      };

      return () => ws.close();
    } catch {
      return () => {};
    }
  }, []);

  const advance = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const idx = STATUS_ORDER.indexOf(order.status);
    if (idx >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[idx + 1];
    try {
      const rawId = (order as Order & { _id?: string })._id ?? id;
      await api.patch(`/api/orders/${rawId}/status`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)),
      );
    } catch (err) {
      console.error('Advance failed:', err);
    }
  };

  return (
    <div>
      <h2
        className="mb-6"
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: '1.25rem',
          color: '#F8FAFC',
        }}
      >
        Order Queue
      </h2>
      <div className="space-y-2">
        {orders.length === 0 && (
          <p
            style={{
              color: '#475569',
              fontFamily: 'Switzer, sans-serif',
              fontSize: '0.875rem',
            }}
          >
            No orders yet.
          </p>
        )}
        <AnimatePresence>
          {orders.map((order) => {
            const statusColor =
              order.status === 'delivered'
                ? '#10B981'
                : order.status === 'delivery'
                  ? '#F59E0B'
                  : order.status === 'kitchen'
                    ? '#06B6D4'
                    : '#94A3B8';
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(248,250,252,0.05)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: '0.7rem',
                    color: '#475569',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 72,
                  }}
                >
                  #{order.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: 'Switzer, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#CBD5E1',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {order.customer}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Switzer, sans-serif',
                      fontSize: '0.7rem',
                      color: '#475569',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {order.items}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: '0.7rem',
                    color: '#334155',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {order.time}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: '0.6875rem',
                    background: `${statusColor}18`,
                    color: statusColor,
                    fontWeight: 500,
                    minWidth: 110,
                    textAlign: 'center',
                  }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                {order.status !== 'delivered' && (
                  <button
                    onClick={() => advance(order.id)}
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      background: 'rgba(30,41,59,0.8)',
                      border: '1px solid rgba(248,250,252,0.08)',
                      color: '#94A3B8',
                      fontFamily: 'Switzer, sans-serif',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    → Advance
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Alert Log ────────────────────────────────────────────────────────────────
function AlertLog() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);

  useEffect(() => {
    api
      .get<{ alerts: Array<{ triggeredAt: string; ingredient: { name?: string }; currentStock: number; threshold: number }> }>('/api/inventory/alerts')
      .then(({ alerts: raw }) => {
        setAlerts(
          raw.map((a) => ({
            time: new Date(a.triggeredAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            item: a.ingredient?.name ?? 'Unknown',
            current: a.currentStock,
            threshold: a.threshold,
          })),
        );
      })
      .catch(() => {
        /* alerts endpoint may be empty */
      });
  }, []);

  return (
    <div>
      <h2
        className="mb-4"
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: '1.25rem',
          color: '#F8FAFC',
        }}
      >
        Low Stock Alerts
      </h2>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(248,250,252,0.06)' }}
      >
        {alerts.length === 0 && (
          <div
            className="px-4 py-3"
            style={{
              color: '#475569',
              fontFamily: 'Switzer, sans-serif',
              fontSize: '0.8125rem',
            }}
          >
            No low-stock alerts logged.
          </div>
        )}
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3"
            style={{
              borderBottom:
                i < alerts.length - 1
                  ? '1px solid rgba(248,250,252,0.04)'
                  : 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: '0.7rem',
                color: '#334155',
                fontVariantNumeric: 'tabular-nums',
                minWidth: 40,
              }}
            >
              {alert.time}
            </span>
            <span
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: '0.8125rem',
                color: '#CBD5E1',
                flex: 1,
              }}
            >
              {alert.item}
            </span>
            <span
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: '0.7rem',
                color: '#EF4444',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {alert.current} / {alert.threshold}
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: '0.65rem',
                background: 'rgba(16,185,129,0.12)',
                color: '#10B981',
              }}
            >
              Email sent
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCockpitPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cc_token');
    navigate('/admin/login');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: '#080B11', fontFamily: 'Switzer, sans-serif' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(8,11,17,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(248,250,252,0.05)',
        }}
      >
        <div className="flex items-center gap-4">
          <span
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.125rem',
              color: '#F8FAFC',
            }}
          >
            Crust&amp;Craft{' '}
            <span style={{ color: '#475569' }}>/ Cockpit</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#10B981' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: '0.75rem',
                color: '#10B981',
              }}
            >
              Live sync
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontSize: '0.75rem',
              color: '#334155',
              paddingLeft: '0.75rem',
              borderLeft: '1px solid rgba(248,250,252,0.08)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-6xl mx-auto space-y-12">
        <InventorySection />
        <OrderQueue />
        <AlertLog />
      </div>
    </div>
  );
}
