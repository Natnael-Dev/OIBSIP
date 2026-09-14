import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server.js';
import { setupTestDB, teardownTestDB, seedTestDB } from './testHelper.js';
import { InventoryItem } from '../models/InventoryItem.js';

describe('Inventory Engine & Atomic Management Suite', () => {
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

  test('GET /api/inventory - Should return all ingredients (5 bases, 5 sauces, cheeses, veggies)', async () => {
    const res = await request(app).get('/api/inventory');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count, 21); // 5 bases + 5 sauces + 5 cheeses + 6 veggies

    const bases = res.body.data.filter((item) => item.category === 'base');
    const sauces = res.body.data.filter((item) => item.category === 'sauce');
    assert.strictEqual(bases.length, 5);
    assert.strictEqual(sauces.length, 5);
  });

  test('GET /api/inventory?category=sauce - Should filter by category', async () => {
    const res = await request(app).get('/api/inventory?category=sauce');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.count, 5);
    res.body.data.forEach((item) => {
      assert.strictEqual(item.category, 'sauce');
    });
  });

  test('PATCH /api/inventory/:id/stock - Admin can manually restock (+20 units)', async () => {
    const item = await InventoryItem.findOne({ name: 'Rustic Sourdough' });
    const initialStock = item.stockQuantity;

    const res = await request(app)
      .patch(`/api/inventory/${item._id}/stock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        operation: 'add',
        quantity: 20
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.stockQuantity, initialStock + 20);

    const updatedInDb = await InventoryItem.findById(item._id);
    assert.strictEqual(updatedInDb.stockQuantity, initialStock + 20);
  });

  test('PATCH /api/inventory/:id/stock - Customer cannot update stock (403 Forbidden)', async () => {
    const item = await InventoryItem.findOne({ name: 'Rustic Sourdough' });

    const res = await request(app)
      .patch(`/api/inventory/${item._id}/stock`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        operation: 'add',
        quantity: 20
      });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  test('PATCH /api/inventory/:id/threshold - Admin can configure custom threshold', async () => {
    const item = await InventoryItem.findOne({ name: 'Fior di Latte Mozzarella' });

    const res = await request(app)
      .patch(`/api/inventory/${item._id}/threshold`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        alertThreshold: 35
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.alertThreshold, 35);
  });
});
