const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeImageUrls } = require('../lib/media');

test('normalizeImageUrls keeps valid image URLs and trims empty values', () => {
  assert.deepEqual(normalizeImageUrls([' /a.png ', '', 'b.jpg ']), ['/a.png', 'b.jpg']);
});

test('normalizeImageUrls accepts a single string input', () => {
  assert.deepEqual(normalizeImageUrls('/single.png'), ['/single.png']);
});

test('normalizeImageUrls returns an empty array for invalid input', () => {
  assert.deepEqual(normalizeImageUrls(null), []);
});
