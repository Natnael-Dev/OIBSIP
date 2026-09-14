import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';

type OrderStatus = 'received' | 'in_kitchen' | 'sent_to_delivery' | 'delivered';

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
  rawId: string;
  customer: string;
  items: string;
  time: string;
  status: OrderStatus;
  total: number;
}

interface AlertEntry {
  time: string;
  item: string;
  current: number;
  threshold: number;
  status: string;
}

const STATUS_ORDER: OrderStatus[] = [
  'received',
  'in_kitchen',
  'sent_to_delivery',
  'delivered',
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Received',
  in_kitchen: 'In Kitchen',
  sent_to_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

function stockColor(stock: number, threshold: number) {
  if (stock === 0) return '#EF4444';
  if (stock <= threshold) return '#F59E0B';
  return '#10B981';
}

// ─── Inventory Section ────────────────────────────────────────────────────────
function InventorySection() {
  const [inventory, setInventory] = useState<InventoryGroup>({});
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchInventory = () => {
    api
      .get<{ success: boolean; data: any[] }>('/api/inventory')
      .then((res) => {
        const rawItems = res.data || [];
        const grouped: InventoryGroup = {};
        for (const item of rawItems) {
          const cat = (item.category || 'other').toUpperCase();
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            id: item._id,
            name: item.name,
            stock: item.stockQuantity,
            threshold: item.alertThreshold || 20,
            category: cat,
          });
        }
        setInventory(grouped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const restock = async (category: string, id: string, amount: number) => {
    try {
      await api.patch(`/api/inventory/${id}/stock`, {
        operation: 'add',
        quantity: amount,
      });

      setInventory((prev) => ({
        ...prev,
        [category]: (prev[category] || []).map((row) =>
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
      <div className="text-slate-400 font-sans text-sm py-4">
        Loading inventory cockpit…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              color: '#F8FAFC',
            }}
          >
            Live Inventory Management
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Real-time tracking of pizza bases, sauces, cheeses, and garden veggies with atomic decrement verification.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-white/5"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(inventory).map(([category, rows]) => (
          <div
            key={category}
            className="rounded-2xl overflow-hidden border border-white/5 bg-slate-900/60 p-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
              <span className="text-[11px] font-mono tracking-widest text-amber-500 font-semibold uppercase">
                {category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {rows.length} varieties
              </span>
            </div>

            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="text-slate-500 border-b border-white/5">
                  <th className="text-left pb-2 font-medium">Item</th>
                  <th className="text-right pb-2 font-medium">Stock</th>
                  <th className="text-right pb-2 font-medium">Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row) => {
                  const color = stockColor(row.stock, row.threshold);
                  const isFlashed = flashIds.has(`${category}-${row.id}`);
                  return (
                    <motion.tr
                      key={row.id}
                      animate={
                        isFlashed
                          ? { backgroundColor: 'rgba(16,185,129,0.2)' }
                          : { backgroundColor: 'transparent' }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <td className="py-2 text-slate-300 pr-2 leading-tight">
                        {row.name}
                      </td>
                      <td
                        className="py-2 text-right font-mono font-bold"
                        style={{ color }}
                      >
                        {row.stock}
                      </td>
                      <td className="py-2 text-right pl-2">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => restock(category, row.id, 20)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 border border-white/5"
                            title="Restock +20 units"
                          >
                            +20
                          </button>
                          <button
                            onClick={() => restock(category, row.id, 50)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 border border-white/5"
                            title="Restock +50 units"
                          >
                            +50
                          </button>
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
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = () => {
    api
      .get<{ success: boolean; data: any[] }>('/api/orders/admin/all')
      .then((res) => {
        const rawOrders = res.data || [];
        setOrders(
          rawOrders.map((o) => ({
            id: o.orderNumber || o._id.slice(-6).toUpperCase(),
            rawId: o._id,
            customer: o.customerDetails?.name || o.customer?.name || 'Customer',
            items: (o.items || [])
              .map((i: any) => `${i.name || 'Artisanal Pizza'} ×${i.quantity || 1}`)
              .join(', '),
            time: new Date(o.createdAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: (o.orderStatus as OrderStatus) || 'received',
            total: o.totalAmount || 0,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    fetchOrders();

    // Attach Socket.io for live incoming orders & status updates
    const socket = getSocket();
    socket.emit('join_admin_room');

    const onNewOrder = (orderData: any) => {
      console.log('[Admin] Live new order received:', orderData);
      fetchOrders();
    };

    const onStatusUpdated = (payload: { orderNumber: string; status: OrderStatus }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === payload.orderNumber ? { ...o, status: payload.status } : o,
        ),
      );
    };

    socket.on('admin:new_order', onNewOrder);
    socket.on('order:status_updated', onStatusUpdated);

    return () => {
      socket.off('admin:new_order', onNewOrder);
      socket.off('order:status_updated', onStatusUpdated);
    };
  }, []);

  const advance = async (rawId: string, currentStatus: OrderStatus) => {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    if (idx >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[idx + 1];

    try {
      await api.patch(`/api/orders/admin/${rawId}/status`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((o) => (o.rawId === rawId ? { ...o, status: nextStatus } : o)),
      );
    } catch (err) {
      console.error('Advance failed:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              color: '#F8FAFC',
            }}
          >
            Live Order Dispatch Board
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Real-time stream of incoming customer orders. Advancing status pushes WebSocket transitions to customer devices.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-white/5"
        >
          ↻ Refresh Orders
        </button>
      </div>

      <div className="space-y-2">
        {loadingOrders ? (
          <p className="text-slate-400 text-xs font-sans">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-slate-500 text-xs font-sans">
            No customer orders placed yet. Place an order in the Customer Builder or Menu to see it live here!
          </div>
        ) : (
          <AnimatePresence>
            {orders.map((order) => {
              const statusColor =
                order.status === 'delivered'
                  ? '#10B981'
                  : order.status === 'sent_to_delivery'
                  ? '#F59E0B'
                  : order.status === 'in_kitchen'
                  ? '#06B6D4'
                  : '#94A3B8';

              return (
                <motion.div
                  key={order.rawId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-4 px-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/5 shadow-md"
                >
                  <span className="font-mono text-xs font-bold text-amber-500 min-w-[75px]">
                    {order.id}
                  </span>

                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs font-semibold text-slate-200">
                      {order.customer} · <span className="font-mono text-amber-400">£{order.total.toFixed(2)}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {order.items}
                    </p>
                  </div>

                  <span className="font-mono text-xs text-slate-500">
                    {order.time}
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-center min-w-[110px]"
                    style={{
                      background: `${statusColor}22`,
                      color: statusColor,
                      border: `1px solid ${statusColor}44`,
                    }}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>

                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => advance(order.rawId, order.status)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      → Advance
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── Alert Log & Automated Cron Monitoring ──────────────────────────────────
function AlertLog() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditMessage, setAuditMessage] = useState('');

  const scanLowStock = () => {
    api
      .get<{ success: boolean; data: any[] }>('/api/inventory')
      .then((res) => {
        const items = res.data || [];
        const lowItems = items.filter(
          (i) => i.stockQuantity <= (i.alertThreshold || 20),
        );

        setAlerts(
          lowItems.map((item) => ({
            time: new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            item: item.name,
            current: item.stockQuantity,
            threshold: item.alertThreshold || 20,
            status: item.stockQuantity === 0 ? 'CRITICAL DEPLETED' : 'WARNING LOW',
          })),
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    scanLowStock();
  }, []);

  const handleTriggerAudit = async () => {
    setRunningAudit(true);
    setAuditMessage('');
    try {
      const res = await api.post<{ success: boolean; message: string }>('/api/inventory/audit-trigger', {});
      setAuditMessage(res.message || 'Audit worker executed successfully.');
      scanLowStock();
    } catch (err: unknown) {
      setAuditMessage(err instanceof Error ? err.message : 'Audit trigger failed');
    } finally {
      setRunningAudit(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              color: '#F8FAFC',
            }}
          >
            Automated Low-Stock Watcher (`node-cron`)
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Scheduled background worker audits ingredient reserves every 10 minutes and emails alerts via Nodemailer.
          </p>
        </div>
        <button
          onClick={handleTriggerAudit}
          disabled={runningAudit}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {runningAudit ? 'Auditing Reserves…' : '⚡ Trigger Immediate Stock Audit'}
        </button>
      </div>

      {auditMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          ✓ {auditMessage}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-white/5 bg-slate-900/60 divide-y divide-white/5">
        {alerts.length === 0 ? (
          <div className="px-4 py-4 text-slate-400 font-sans text-xs flex items-center gap-2">
            <span className="text-emerald-400">✓</span> All ingredient reserves are healthy (&gt; 20 units). Zero emergency breaches detected.
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500">{alert.time}</span>
                <span className="font-semibold text-slate-200">{alert.item}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-red-400 font-bold">
                  {alert.current} / {alert.threshold} units
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                  {alert.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Cockpit Screen ───────────────────────────────────────────────────────
export default function AdminCockpitPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    navigate('/admin/login');
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-sans"
      style={{ background: '#080B11' }}
    >
      {/* Top Cockpit Header */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(8,11,17,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(248,250,252,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.25rem',
              color: '#F8FAFC',
            }}
          >
            Crust &amp; Craft <span className="text-amber-500 font-sans text-xs">/ Admin Cockpit</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Level 3 Oasis SIP
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="text-xs text-emerald-400 font-mono">
              Live Socket Gateway
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer pl-3 border-l border-white/10"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-12">
        <InventorySection />
        <OrderQueue />
        <AlertLog />
      </div>
    </div>
  );
}
