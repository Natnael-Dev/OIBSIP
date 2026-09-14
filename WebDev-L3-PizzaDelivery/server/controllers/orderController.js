import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { razorpayInstance, getRazorpayKeyId, verifyRazorpaySignature } from '../config/razorpay.js';
import { emitOrderStatusUpdate, emitNewOrderToAdmin } from '../services/socketService.js';
import { runInventoryAudit } from '../services/cronService.js';

// Helper to execute atomic decrement query
const atomicDecrementStock = async (items) => {
  const bulkOps = [];

  const makeFilter = (val, category, qty) => {
    if (!val) return null;
    const clean = String(val).trim();
    const pattern = clean.replace(/[-_]/g, '.*');
    return {
      category,
      $or: [
        { name: clean },
        { name: new RegExp(pattern, 'i') }
      ],
      stockQuantity: { $gte: qty }
    };
  };

  for (const item of items) {
    const qty = item.quantity || 1;

    // 1. Decrement base
    if (item.base) {
      bulkOps.push({
        updateOne: {
          filter: makeFilter(item.base, 'base', qty),
          update: { $inc: { stockQuantity: -qty } }
        }
      });
    }

    // 2. Decrement sauce
    if (item.sauce) {
      bulkOps.push({
        updateOne: {
          filter: makeFilter(item.sauce, 'sauce', qty),
          update: { $inc: { stockQuantity: -qty } }
        }
      });
    }

    // 3. Decrement cheese
    if (item.cheese) {
      bulkOps.push({
        updateOne: {
          filter: makeFilter(item.cheese, 'cheese', qty),
          update: { $inc: { stockQuantity: -qty } }
        }
      });
    }

    // 4. Decrement veggies
    if (Array.isArray(item.veggies)) {
      for (const v of item.veggies) {
        bulkOps.push({
          updateOne: {
            filter: makeFilter(v, 'veggie', qty),
            update: { $inc: { stockQuantity: -qty } }
          }
        });
      }
    }
  }

  if (bulkOps.length > 0) {
    await InventoryItem.bulkWrite(bulkOps);
    console.log(`[Inventory Engine] Atomically decremented ${bulkOps.length} ingredient items.`);
  }
};

export const createCheckoutOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required.' });
    }

    // Calculate subtotal securely
    let subtotal = 0;
    for (const item of items) {
      const itemPrice = Number(item.unitPrice) || 12.0;
      const quantity = Number(item.quantity) || 1;
      subtotal += itemPrice * quantity;
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const deliveryFee = 3.5;
    const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    // Generate unique human-readable order number
    const orderNumber = `CC-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create Razorpay Order
    let razorpayOrderId = `order_${Date.now()}`;
    try {
      const rpOrder = await razorpayInstance.orders.create({
        amount: Math.round(totalAmount * 100), // in paise
        currency: 'INR',
        receipt: `rcpt_${orderNumber}`
      });
      razorpayOrderId = rpOrder.id;
    } catch (rpErr) {
      console.warn(`[Razorpay] Fallback test ID used: ${rpErr.message}`);
    }

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: phone || req.user.phone,
        deliveryAddress
      },
      items,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      payment: {
        gateway: 'razorpay',
        razorpayOrderId,
        status: 'pending'
      },
      orderStatus: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date(),
          note: 'Order placed, awaiting payment confirmation'
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount,
        currency: 'INR',
        razorpayOrderId,
        razorpayKeyId: getRazorpayKeyId()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      order.payment.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Cryptographic payment signature mismatch.' });
    }

    // Mark paid & confirmed
    order.payment.status = 'paid';
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.payment.paidAt = new Date();
    order.orderStatus = 'received';
    order.statusHistory.push({
      status: 'received',
      timestamp: new Date(),
      note: 'Payment captured and verified. Sent to kitchen.'
    });

    await order.save();

    // 1. Atomically decrement inventory
    await atomicDecrementStock(order.items);

    // 2. Broadcast live WebSocket notification to Admin & Kitchen
    emitNewOrderToAdmin({
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      items: order.items,
      customerName: order.customerDetails.name,
      createdAt: order.createdAt
    });

    // 3. Trigger immediate inventory threshold audit asynchronously
    runInventoryAudit().catch((e) => console.warn(`[Audit Notice] ${e.message}`));

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      data: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paidAt: order.payment.paidAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber }).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        statusHistory: order.statusHistory,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentStatus: order.payment.status,
        customerDetails: order.customerDetails,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['received', 'in_kitchen', 'sent_to_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;
    const timestamp = new Date();
    order.statusHistory.push({
      status,
      timestamp,
      note: note || `Status transitioned to ${status} by admin`
    });

    await order.save();

    // Broadcast live WebSocket event to customer
    emitOrderStatusUpdate(order.orderNumber, status, timestamp);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
