function getDisplayName(user) {
  if (!user || typeof user !== 'object') return 'Unknown user';

  const username = typeof user.username === 'string' ? user.username.trim() : '';
  const name = typeof user.name === 'string' ? user.name.trim() : '';

  return username || name || 'Unknown user';
}

function getProfileHandle(value) {
  const cleaned = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned ? `@${cleaned}` : '@user';
}

function getFollowSummary({ followersCount = 0, followingCount = 0 } = {}) {
  const formatCount = (count) => {
    const safeCount = Number.isFinite(count) ? count : 0;

    if (safeCount >= 1000) {
      return `${(safeCount / 1000).toFixed(safeCount >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`;
    }
    return `${safeCount}`;
  };

  return {
    followersLabel: `${formatCount(followersCount)} followers`,
    followingLabel: `${formatCount(followingCount)} following`,
  };
}

module.exports = {
  getDisplayName,
  getProfileHandle,
  getFollowSummary,
};
