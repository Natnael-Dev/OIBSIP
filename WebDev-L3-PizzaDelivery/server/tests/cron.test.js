import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server.js';
import { setupTestDB, teardownTestDB, seedTestDB } from './testHelper.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { runInventoryAudit } from '../services/cronService.js';

describe('Background node-cron Automation & Alert Dispatch Suite', () => {
  let adminToken = '';

  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    const { admin } = await seedTestDB();
    const secret = process.env.JWT_SECRET || 'test_secret_oasis_sip_2026';
    adminToken = jwt.sign({ id: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });
  });

  test('runInventoryAudit - Should report 0 breaches when stock is healthy', async () => {
    // All initial seed items have stock >= 25, thresholds = 20
    const result = await runInventoryAudit();
    assert.strictEqual(result.breached, 0);
  });

  test('runInventoryAudit - Should detect breached items and dispatch alert', async () => {
    // Drop one item below threshold
    await InventoryItem.updateOne(
      { name: 'Rustic Sourdough' },
      { $set: { stockQuantity: 12, alertThreshold: 20, lastAlertSentAt: null } }
    );

    const result = await runInventoryAudit();
    assert.strictEqual(result.breached, 1);
    assert.strictEqual(result.alerted, 1);

    // Verify lastAlertSentAt timestamp updated in DB
    const item = await InventoryItem.findOne({ name: 'Rustic Sourdough' });
    assert.ok(item.lastAlertSentAt);
  });

  test('runInventoryAudit - Should deduplicate alerts within 4-hour cooldown window', async () => {
    // 1. Drop item below threshold
    await InventoryItem.updateOne(
      { name: 'Rustic Sourdough' },
      { $set: { stockQuantity: 12, alertThreshold: 20, lastAlertSentAt: null } }
    );

    // First audit: alerts item
    const firstRun = await runInventoryAudit();
    assert.strictEqual(firstRun.breached, 1);
    assert.strictEqual(firstRun.alerted, 1);

    // Second immediate audit: detects breach, but cooldown suppresses duplicate email
    const immediateRepeat = await runInventoryAudit();
    assert.strictEqual(immediateRepeat.breached, 1);
    assert.strictEqual(immediateRepeat.alerted, 0);
  });

  test('POST /api/inventory/audit - Admin can trigger on-demand inventory audit', async () => {
    const res = await request(app)
      .post('/api/inventory/audit')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.match(res.body.message, /audit executed/i);
  });
});
