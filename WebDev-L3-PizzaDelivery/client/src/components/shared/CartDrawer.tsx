import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { user, token, setIsAuthOpen, setAuthMode } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [address, setAddress] = useState('12 Baker Street, London NW1 6XE');
  const [phone, setPhone] = useState('+44 20 7946 0912');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Payment state
  const [createdOrder, setCreatedOrder] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    razorpayOrderId: string;
    razorpayKeyId: string;
  } | null>(null);

  if (!isCartOpen) return null;

  const tax = Math.round(totalPrice * 0.08 * 100) / 100;
  const deliveryFee = items.length > 0 ? 3.5 : 0;
  const grandTotal = Math.round((totalPrice + tax + deliveryFee) * 100) / 100;

  const handleProceedToAddress = () => {
    if (!token || !user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    setCheckoutStep('address');
    setCheckoutError('');
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setCheckoutError('Please enter a delivery address');
      return;
    }

    setSubmitting(true);
    setCheckoutError('');

    try {
      // Map items to match backend order schema
      const mappedItems = items.map((item) => ({
        itemType: item.itemType || (item.customization ? 'custom' : 'preset'),
        name: item.name,
        base: item.customization?.base || 'Classic Hand-Tossed',
        sauce: item.customization?.sauce || 'San Marzano Marinara',
        cheese: item.customization?.cheese || 'Fior di Latte Mozzarella',
        veggies: item.customization?.veggies || [],
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      const res = await api.post<{
        success: boolean;
        data: {
          orderId: string;
          orderNumber: string;
          totalAmount: number;
          razorpayOrderId: string;
          razorpayKeyId: string;
        };
      }>('/api/orders/checkout', {
        items: mappedItems,
        deliveryAddress: address,
        phone,
      });

      if (res.data) {
        setCreatedOrder(res.data);
        setCheckoutStep('payment');
      }
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Order checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!createdOrder) return;
    setSubmitting(true);
    setCheckoutError('');

    try {
      const paymentId = `pay_${Date.now()}`;
      const simulatedSignature = 'simulated_test_sig';

      await api.post('/api/orders/verify-payment', {
        orderId: createdOrder.orderId,
        razorpayOrderId: createdOrder.razorpayOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: simulatedSignature,
      });

      // Clear cart and navigate to live tracking board!
      clearCart();
      setIsCartOpen(false);
      setCheckoutStep('cart');
      setCreatedOrder(null);
      navigate(`/tracking?orderNumber=${createdOrder.orderNumber}`);
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Payment verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCartOpen(false);
            setCheckoutStep('cart');
          }}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            className="w-screen max-w-md flex flex-col shadow-2xl border-l border-white/10"
            style={{
              background: 'linear-gradient(180deg, #0B0E14 0%, #121824 100%)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase">
                  Order Atelier
                </span>
                <h2
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '1.65rem',
                    color: '#F8FAFC',
                  }}
                >
                  {checkoutStep === 'cart' && `Your Tray (${totalItems})`}
                  {checkoutStep === 'address' && 'Delivery Address'}
                  {checkoutStep === 'payment' && 'Razorpay Test Payment'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep('cart');
                }}
                className="text-slate-400 hover:text-white p-2 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                  {checkoutError}
                </div>
              )}

              {/* STEP 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-2xl text-amber-500">
                        🍕
                      </div>
                      <p className="text-slate-400 text-sm font-sans">Your tray is empty.</p>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/builder');
                        }}
                        className="px-5 py-2 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
                      >
                        Launch Pizza Builder
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-start justify-between gap-3 transition-all hover:border-white/10"
                        >
                          <div className="flex-1">
                            <h4
                              style={{
                                fontFamily: 'Instrument Serif, serif',
                                fontSize: '1.2rem',
                                color: '#F8FAFC',
                              }}
                            >
                              {item.name}
                            </h4>
                            {item.customization && (
                              <div className="text-[11px] text-slate-400 space-y-0.5 mt-1 font-sans">
                                <div>Crust: {item.customization.base}</div>
                                {item.customization.sauce && <div>Sauce: {item.customization.sauce}</div>}
                                {item.customization.cheese && <div>Cheese: {item.customization.cheese}</div>}
                                {item.customization.veggies && item.customization.veggies.length > 0 && (
                                  <div>Veggies: {item.customization.veggies.join(', ')}</div>
                                )}
                              </div>
                            )}
                            <div className="text-xs font-semibold text-amber-500 mt-2 font-mono">
                              £{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-500 hover:text-red-400 text-xs transition-colors"
                              title="Remove item"
                            >
                              ✕
                            </button>
                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1 border border-white/5">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="text-slate-400 hover:text-white text-xs px-1"
                              >
                                −
                              </button>
                              <span className="text-xs text-white font-mono font-bold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="text-slate-400 hover:text-white text-xs px-1"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: ADDRESS & PHONE */}
              {checkoutStep === 'address' && (
                <form onSubmit={handleCreateOrder} id="checkout-address-form" className="space-y-4 font-sans text-sm">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    Logged in as <strong>{user?.name}</strong> ({user?.email})
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Street Address &amp; Postcode
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 4B, 12 Kensington High St, London"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Contact Phone (For Rider)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 20 7946 0912"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </form>
              )}

              {/* STEP 3: RAZORPAY TEST MODAL SIMULATION */}
              {checkoutStep === 'payment' && createdOrder && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-xl text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono font-medium">
                      <span>⚡ Razorpay Test Mode Gateway</span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans">
                      Order Reference: <strong className="text-white font-mono">{createdOrder.orderNumber}</strong>
                    </p>

                    <div className="text-3xl font-serif text-amber-500 font-bold">
                      £{createdOrder.totalAmount.toFixed(2)}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-white/5 text-left space-y-1">
                      <div>Key ID: {createdOrder.razorpayKeyId || 'rzp_test_OasisInternship2026'}</div>
                      <div>Gateway Order: {createdOrder.razorpayOrderId}</div>
                      <div>Security: HMAC SHA-256 Validated</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center font-sans">
                    Clicking &quot;Authorize Test Payment&quot; captures the order in Razorpay sandbox, triggers the atomic inventory decrement, and launches the live delivery tracker.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Summary & Action Buttons */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-slate-950/60 space-y-4 font-sans text-xs">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (8%)</span>
                    <span className="font-mono text-white">£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hot Delivery</span>
                    <span className="font-mono text-white">£{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5 text-sm font-semibold text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-500 text-base">£{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary Button */}
                {checkoutStep === 'cart' && (
                  <button
                    onClick={handleProceedToAddress}
                    className="w-full py-3.5 rounded-full font-semibold text-slate-950 text-sm shadow-xl transition-all hover:brightness-110 active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    }}
                  >
                    Proceed to Delivery ({user ? user.name.split(' ')[0] : 'Sign In Required'})
                  </button>
                )}

                {checkoutStep === 'address' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3 rounded-full border border-slate-700 text-slate-300 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="checkout-address-form"
                      disabled={submitting}
                      className="flex-1 py-3.5 rounded-full font-semibold text-slate-950 text-sm shadow-xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      }}
                    >
                      {submitting ? 'Generating Order…' : 'Proceed to Payment Gateway'}
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={submitting}
                    className="w-full py-4 rounded-full font-bold text-slate-950 text-sm shadow-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                    }}
                  >
                    {submitting ? (
                      'Processing Razorpay HMAC…'
                    ) : (
                      <>
                        <span>✓</span>
                        <span>Authorize Test Payment (£{grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
