import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { app } from '../server.js';
import { setupTestDB, teardownTestDB, seedTestDB } from './testHelper.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Order } from '../models/Order.js';

describe('Order Lifecycle, Atomic Stock Decrement & Payment Gateway Suite', () => {
  let adminToken = '';
  let customerToken = '';

  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    const { customer, admin } = await seedTestDB();
    const secret = process.env.JWT_SECRET || 'test_secret_oasis_sip_2026';
    adminToken = jwt.sign({ id: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });
    customerToken = jwt.sign({ id: customer._id, role: 'customer' }, secret, { expiresIn: '1h' });
  });

  test('POST /api/orders/checkout - Should calculate tax (8%), delivery, and return Razorpay payload', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          {
            name: 'Custom Artisan Pie',
            itemType: 'custom',
            base: 'Rustic Sourdough',
            sauce: 'Fiery Arrabiata',
            cheese: 'Fior di Latte Mozzarella',
            veggies: ['Slow-Caramelized Onions', 'Kalamata Black Olives'],
            quantity: 1,
            unitPrice: 17.5
          }
        ],
        deliveryAddress: '42 Tech Boulevard, Suite 100',
        phone: '+15551234567'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.orderId);
    assert.ok(res.body.data.orderNumber);
    assert.strictEqual(res.body.data.totalAmount, 22.4); // 17.5 + (17.5 * 0.08 = 1.40) + 3.50 = 22.40
    assert.ok(res.body.data.razorpayOrderId);
  });

  test('POST /api/orders/verify-payment - Should verify HMAC, mark PAID, and ATOMICALLY DECREMENT stock', async () => {
    // 1. Initial stock counts
    const sourdoughBefore = await InventoryItem.findOne({ name: 'Rustic Sourdough' });
    const arrabiataBefore = await InventoryItem.findOne({ name: 'Fiery Arrabiata' });
    const mozzarellaBefore = await InventoryItem.findOne({ name: 'Fior di Latte Mozzarella' });
    const onionsBefore = await InventoryItem.findOne({ name: 'Slow-Caramelized Onions' });
    const olivesBefore = await InventoryItem.findOne({ name: 'Kalamata Black Olives' });

    // 2. Create order
    const checkoutRes = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          {
            name: 'Custom Artisan Pie',
            itemType: 'custom',
            base: 'Rustic Sourdough',
            sauce: 'Fiery Arrabiata',
            cheese: 'Fior di Latte Mozzarella',
            veggies: ['Slow-Caramelized Onions', 'Kalamata Black Olives'],
            quantity: 1,
            unitPrice: 17.5
          }
        ],
        deliveryAddress: '42 Tech Boulevard, Suite 100'
      });

    const { orderId, razorpayOrderId } = checkoutRes.body.data;
    const mockPaymentId = `pay_${Date.now()}`;

    // 3. Compute authentic HMAC SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mockSecretForHMACVerification2026';
    const payload = `${razorpayOrderId}|${mockPaymentId}`;
    const authenticSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // 4. Verify payment
    const verifyRes = await request(app)
      .post('/api/orders/verify-payment')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId,
        razorpayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: authenticSignature
      });

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.success, true);
    assert.strictEqual(verifyRes.body.data.orderStatus, 'received');

    // 5. CRITICAL VERIFICATION: Inspect database to assert exact atomic decrement (-1 unit)
    const sourdoughAfter = await InventoryItem.findOne({ name: 'Rustic Sourdough' });
    const arrabiataAfter = await InventoryItem.findOne({ name: 'Fiery Arrabiata' });
    const mozzarellaAfter = await InventoryItem.findOne({ name: 'Fior di Latte Mozzarella' });
    const onionsAfter = await InventoryItem.findOne({ name: 'Slow-Caramelized Onions' });
    const olivesAfter = await InventoryItem.findOne({ name: 'Kalamata Black Olives' });

    assert.strictEqual(sourdoughAfter.stockQuantity, sourdoughBefore.stockQuantity - 1);
    assert.strictEqual(arrabiataAfter.stockQuantity, arrabiataBefore.stockQuantity - 1);
    assert.strictEqual(mozzarellaAfter.stockQuantity, mozzarellaBefore.stockQuantity - 1);
    assert.strictEqual(onionsAfter.stockQuantity, onionsBefore.stockQuantity - 1);
    assert.strictEqual(olivesAfter.stockQuantity, olivesBefore.stockQuantity - 1);
  });

  test('POST /api/orders/verify-payment - Should reject invalid HMAC signature', async () => {
    const checkoutRes = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          {
            name: 'Test Pizza',
            base: 'Rustic Sourdough',
            sauce: 'San Marzano Marinara',
            cheese: 'Fior di Latte Mozzarella',
            unitPrice: 15.0,
            quantity: 1
          }
        ],
        deliveryAddress: '123 Fake Street',
        phone: '+15551234567'
      });

    const { orderId, razorpayOrderId } = checkoutRes.body.data;

    const res = await request(app)
      .post('/api/orders/verify-payment')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId,
        razorpayOrderId,
        razorpayPaymentId: 'pay_tampered_123',
        razorpaySignature: 'invalid_forged_signature_hash'
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /signature mismatch/i);
  });

  test('PATCH /api/orders/:id/status - Admin can advance order status in real-time', async () => {
    const user = await (await import('../models/User.js')).User.findOne({ role: 'customer' });
    const order = await Order.create({
      orderNumber: 'CC-TEST-001',
      customer: user._id,
      customerDetails: {
        name: user.name,
        email: user.email,
        phone: '+15551234567',
        deliveryAddress: '123 Test St'
      },
      items: [
        {
          name: 'Margherita',
          base: 'Classic Hand-Tossed',
          sauce: 'San Marzano Marinara',
          cheese: 'Fior di Latte Mozzarella',
          unitPrice: 18.5,
          quantity: 1
        }
      ],
      subtotal: 18.5,
      tax: 1.48,
      deliveryFee: 3.5,
      totalAmount: 23.48,
      orderStatus: 'received'
    });

    // Advance to in_kitchen
    const kitchenRes = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'in_kitchen' });

    assert.strictEqual(kitchenRes.status, 200);
    assert.strictEqual(kitchenRes.body.data.orderStatus, 'in_kitchen');

    // Advance to sent_to_delivery
    const deliveryRes = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'sent_to_delivery' });

    assert.strictEqual(deliveryRes.status, 200);
    assert.strictEqual(deliveryRes.body.data.orderStatus, 'sent_to_delivery');
  });
});
