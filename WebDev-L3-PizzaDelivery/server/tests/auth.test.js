import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { setupTestDB, teardownTestDB, seedTestDB } from './testHelper.js';
import { User } from '../models/User.js';

describe('Authentication & RBAC Security Suite', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await seedTestDB();
  });

  test('POST /api/auth/register - Should register customer and generate verification token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Elena Rostova',
        email: 'elena@example.com',
        password: 'Password123!',
        phone: '+15552345678'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.email, 'elena@example.com');
    assert.strictEqual(res.body.data.isVerified, false);

    // Verify token exists in database
    const user = await User.findOne({ email: 'elena@example.com' });
    assert.ok(user);
    assert.ok(user.verificationToken);
  });

  test('POST /api/auth/register - Should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Test',
        email: 'customer@crustcraft.com', // Already seeded
        password: 'Password123!'
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  test('GET /api/auth/verify-email - Should activate account with valid token', async () => {
    const user = await User.create({
      name: 'Verify Test',
      email: 'verify@example.com',
      passwordHash: await User.hashPassword('Pass123!'),
      role: 'customer',
      isVerified: false,
      verificationToken: 'test_token_12345'
    });

    const res = await request(app)
      .get('/api/auth/verify-email?token=test_token_12345');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const updated = await User.findById(user._id);
    assert.strictEqual(updated.isVerified, true);
    assert.strictEqual(updated.verificationToken, null);
  });

  test('POST /api/auth/login - Should authenticate customer and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@crustcraft.com',
        password: 'Customer123!'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.user.role, 'customer');
  });

  test('POST /api/auth/login - Should reject invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@crustcraft.com',
        password: 'WrongPassword999!'
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  test('POST /api/auth/admin-login - Should grant access to admin user', async () => {
    const res = await request(app)
      .post('/api/auth/admin-login')
      .send({
        email: 'admin@crustcraft.com',
        password: 'AdminSecret2026!'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.admin.role, 'admin');
  });

  test('POST /api/auth/admin-login - Should reject customer account with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/admin-login')
      .send({
        email: 'customer@crustcraft.com',
        password: 'Customer123!'
      });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Administrative role required/i);
  });

  test('POST /api/auth/forgot-password & reset-password flow', async () => {
    // 1. Request reset
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'customer@crustcraft.com' });

    assert.strictEqual(forgotRes.status, 200);

    const user = await User.findOne({ email: 'customer@crustcraft.com' });
    assert.ok(user.resetPasswordToken);

    // 2. Reset password using token
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: user.resetPasswordToken,
        newPassword: 'BrandNewPassword456!'
      });

    assert.strictEqual(resetRes.status, 200);

    // 3. Verify login works with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@crustcraft.com',
        password: 'BrandNewPassword456!'
      });

    assert.strictEqual(loginRes.status, 200);
  });
});
