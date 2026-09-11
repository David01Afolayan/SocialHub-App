const test = require('node:test');
const assert = require('node:assert/strict');

const { buildNotificationMessage } = require('../lib/notifications');

test('buildNotificationMessage formats like notifications', () => {
  assert.equal(buildNotificationMessage({ type: 'like', actorName: 'Alice' }), 'Alice liked your post');
});

test('buildNotificationMessage formats comment notifications', () => {
  assert.equal(buildNotificationMessage({ type: 'comment', actorName: 'Alice' }), 'Alice commented on your post');
});

test('buildNotificationMessage formats follow notifications', () => {
  assert.equal(buildNotificationMessage({ type: 'follow', actorName: 'Alice' }), 'Alice followed you');
});
