const test = require('node:test');
const assert = require('node:assert/strict');

const { getDisplayName, getProfileHandle, getFollowSummary } = require('../lib/profile');

test('getDisplayName prefers username when available', () => {
  assert.equal(getDisplayName({ name: 'Jane Doe', username: 'janedoe' }), 'janedoe');
});

test('getDisplayName falls back to name when username is missing', () => {
  assert.equal(getDisplayName({ name: 'Jane Doe', username: null }), 'Jane Doe');
});

test('getDisplayName handles missing user data gracefully', () => {
  assert.equal(getDisplayName(null), 'Unknown user');
  assert.equal(getDisplayName({ username: '   ', name: '  Jane Doe  ' }), 'Jane Doe');
});

test('getProfileHandle formats a clean public handle', () => {
  assert.equal(getProfileHandle('  Jane Doe  '), '@jane-doe');
});

test('getProfileHandle handles empty or missing input gracefully', () => {
  assert.equal(getProfileHandle('   '), '@user');
  assert.equal(getProfileHandle(null), '@user');
});

test('getFollowSummary returns readable counts', () => {
  assert.deepEqual(getFollowSummary({ followersCount: 1200, followingCount: 48 }), {
    followersLabel: '1.2K followers',
    followingLabel: '48 following',
  });
});

test('getFollowSummary defaults missing counts to zero', () => {
  assert.deepEqual(getFollowSummary({}), {
    followersLabel: '0 followers',
    followingLabel: '0 following',
  });
});
