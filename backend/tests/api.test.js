const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
process.env.JWT_SECRET = 'test-only-secret-with-more-than-32-characters';
process.env.CLIENT_URL = 'http://localhost:3000';
const app = require('../app');
const User = require('../models/User');
const Order = require('../models/Order');
const { quote, products } = require('../lib/catalog');
let mongo, alice, bob, saved;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all([User.init(), Order.init()]);
  alice = request.agent(app); bob = request.agent(app);
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
test('catalog is shared and uses official Tunisian TND prices instead of DZD', async () => {
  const res = await request(app).get('/api/products').expect(200);
  assert.equal(res.body.data.length, products.length);
  assert.equal(res.body.data[0].prices.TND, 30);
  assert.notEqual(res.body.data[0].prices.TND, 4500);
  assert.equal(JSON.stringify(res.body).includes('DZD'), false);
  await request(app).post('/api/products/seed').expect(404);
});
test('unknown email and wrong passwords are rejected', async () => {
  await alice.post('/api/auth/login').send({ email: 'missing@example.com', password: 'password123' }).expect(401);
  const res = await alice.post('/api/auth/register').send({ username: 'Alice', email: 'alice@example.com', password: 'password123' }).expect(201);
  assert.ok(res.headers['set-cookie'][0].includes('HttpOnly'));
  assert.equal(res.body.token, undefined);
  assert.equal(res.body.user.password, undefined);
  const record = await User.findOne({ email: 'alice@example.com' });
  assert.notEqual(record.password, 'password123');
  await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'wrongpassword' }).expect(401);
  await request(app).post('/api/auth/register').send({ username: 'Alice', email: 'alice@example.com', password: 'password123' }).expect(409);
  await alice.get('/api/auth/me').expect(200);
});
const payload = () => ({ requestId: randomUUID(), customer: { name: 'Alice', phone: '+216 20 123 456', email: 'spoof@example.com' }, items: [{ slug: products[0].slug, quantity: 2, price: .01 }], currency: 'EUR', total: .02, promoCode: 'IONARA10', paymentMethod: 'manual', locale: 'ar' });
test('orders require login and calculate trusted prices, discount and customer email', async () => {
  await request(app).post('/api/orders').send(payload()).expect(401);
  const body = payload();
  const res = await alice.post('/api/orders').send(body).expect(201);
  saved = res.body.order;
  assert.equal(saved.total, 45);
  assert.equal(saved.discount, 5);
  assert.equal(saved.customer.email, 'alice@example.com');
  assert.equal(saved.customer.phone, '+21620123456');
  assert.equal(saved.paymentStatus, 'unpaid');
  assert.equal(saved.status, 'pending_confirmation');
  assert.equal(saved.locale, 'ar');
  const repeated = await alice.post('/api/orders').send(body).expect(200);
  assert.equal(repeated.body.order._id, saved._id);
  assert.equal(await Order.countDocuments(), 1);
});
test('order ownership is enforced and records survive database reconnect', async () => {
  await bob.post('/api/auth/register').send({ username: 'Bob', email: 'bob@example.com', password: 'password123' }).expect(201);
  await bob.get('/api/orders/' + saved.orderNumber).expect(404);
  await request(app).get('/api/orders/' + saved.orderNumber).expect(401);
  await mongoose.disconnect(); await mongoose.connect(mongo.getUri());
  const res = await alice.get('/api/orders/' + saved.orderNumber).expect(200);
  assert.equal(res.body.order.total, 45);
  assert.equal(res.body.order.deliveredCredentials, undefined);
  const list = await alice.get('/api/orders').expect(200);
  assert.equal(list.body.orders.length, 1);
  assert.equal(list.body.orders[0].orderNumber, saved.orderNumber);
  await bob.patch('/api/orders/' + saved.orderNumber).send({ status: 'delivered', paymentStatus: 'paid' }).expect(403);
  await User.updateOne({ email: 'alice@example.com' }, { $set: { role: 'admin' } });
  const beforeProd = await request(app).get('/api/products/' + products[0].slug).expect(200);
  const updated = await alice.patch('/api/orders/' + saved.orderNumber).send({ status: 'delivered', paymentStatus: 'paid' }).expect(200);
  assert.equal(updated.body.order.status, 'delivered');
  assert.equal(updated.body.order.paymentStatus, 'paid');
  assert.ok(updated.body.order.pointsAwarded > 0);
  const afterProd = await request(app).get('/api/products/' + products[0].slug).expect(200);
  assert.equal(afterProd.body.data.soldCount, beforeProd.body.data.soldCount + 2);
  const meAfterConfirm = await alice.get('/api/auth/me').expect(200);
  assert.ok(meAfterConfirm.body.user.loyaltyPoints > 25);
  assert.match(meAfterConfirm.body.user.referralCode, /^ION-/);
  const tracked = await request(app).get('/api/orders/track').query({ orderNumber: saved.orderNumber, phone: '20 123 456' }).expect(200);
  assert.equal(tracked.body.order.orderNumber, saved.orderNumber);
  const proofUpdated = await request(app).post('/api/orders/track/proof').send({ orderNumber: saved.orderNumber, phone: '+21620123456', paymentProof: 'D17-REF-998877' }).expect(200);
  assert.equal(proofUpdated.body.order.paymentProof, 'D17-REF-998877');
  const revCreated = await alice.post('/api/products/' + products[0].slug + '/reviews').send({ rating: 5, comment: 'Excellent pack Steam Offline, livré rapidement !' }).expect(201);
  assert.equal(revCreated.body.review.verifiedPurchase, true);
  const revList = await request(app).get('/api/products/' + products[0].slug + '/reviews').expect(200);
  assert.ok(revList.body.reviews.some(r => r.comment.includes('Excellent pack Steam Offline')));
  await User.updateOne({ email: 'alice@example.com' }, { $set: { role: 'customer' } });
});
test('rejects invalid quantities, missing currency prices, fake providers and invalid promotions', async () => {
  for (const quantity of [-1, 0, 1.5, 11]) await alice.post('/api/orders').send({ ...payload(), items: [{ slug: products[0].slug, quantity }] }).expect(400);
  const originalTnd = products[0].prices.TND;
  try {
    products[0].prices.TND = null;
    await alice.post('/api/orders').send({ ...payload(), currency: 'TND' }).expect(409);
  } finally {
    products[0].prices.TND = originalTnd;
  }
  await alice.post('/api/orders').send({ ...payload(), paymentMethod: 'card' }).expect(400);
  await alice.post('/api/orders').send({ ...payload(), paymentMethod: 'BaridiMob' }).expect(400);
  await alice.post('/api/orders').send({ ...payload(), promoCode: 'FAKE' }).expect(400);
  await alice.post('/api/orders').send({ ...payload(), items: [{ slug: 'valorant-points', planId: 'non-existent-plan', quantity: 1 }] }).expect(400);
  await alice.post('/api/orders').send({ ...payload(), customer: { name: 'Alice', phone: '+213555000000' } }).expect(400);
  assert.equal(await Order.countDocuments(), 1);
  for (const method of ['d17', 'flouci', 'wafacash', 'isizitounapayment', 'virmentbancaire', 'solde ooredoo']) {
    const res = await alice.post('/api/orders').send({
      ...payload(),
      currency: 'TND',
      promoCode: '',
      paymentMethod: method,
      confirmationChannel: 'instagram',
      notes: 'Riot ID: Player#TN1',
      items: [{ slug: 'valorant-points', planId: 'vp-1000', quantity: 1 }],
    }).expect(201);
    assert.equal(res.body.order.total, 40);
    assert.equal(res.body.order.paymentMethod, method);
    assert.equal(res.body.order.confirmationChannel, 'instagram');
    assert.equal(res.body.order.notes, 'Riot ID: Player#TN1');
    assert.equal(res.body.order.items[0].title, 'Valorant Points (1000 VP)');
  }
});
test('TND pricing uses millime precision when explicitly configured', () => {
  const original = products[0].prices.TND;
  try {
    products[0].prices.TND = 12.345;
    const result = quote([{ slug: products[0].slug, quantity: 3 }], 'TND', 'IONARA10');
    assert.equal(result.subtotal, 37.035);
    assert.equal(result.discount, 3.704);
    assert.equal(result.total, 33.331);
  } finally { products[0].prices.TND = original; }
});
test('cross-origin writes are rejected and logout clears the session', async () => {
  await alice.post('/api/orders').set('Origin', 'https://untrusted.example').send(payload()).expect(403);
  await alice.post('/api/auth/logout').send({}).expect(200);
  await alice.get('/api/auth/me').expect(401);
});
test('database failure returns 503 with no fake authentication or order success', async () => {
  await mongoose.disconnect();
  await request(app).get('/api/health').expect(503);
  await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'password123' }).expect(503);
  await request(app).post('/api/auth/register').send({ username: 'New', email: 'new@example.com', password: 'password123' }).expect(503);
  await request(app).post('/api/orders').send(payload()).expect(503);
});
