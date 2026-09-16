function normalizeMediaUrls(input) {
  if (!input) return [];

  const values = Array.isArray(input) ? input : [input];

  return values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .filter((value) => /\.(png|jpe?g|gif|webp|svg|mp4|webm|mov)(\?.*)?$/i.test(value) || /^https?:\/\//i.test(value) || /^data:(image|video)\//i.test(value));
}

module.exports = {
  normalizeMediaUrls,
  normalizeImageUrls: normalizeMediaUrls,
};
