function normalizeImageUrls(input) {
  if (!input) return [];

  const values = Array.isArray(input) ? input : [input];

  return values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .filter((value) => /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value) || /^https?:\/\//i.test(value) || /^data:image\//i.test(value));
}

module.exports = {
  normalizeImageUrls,
};
