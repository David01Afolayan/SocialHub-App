function getDisplayName(user) {
  return user.username?.trim() || user.name?.trim() || 'Unknown user';
}

function getProfileHandle(value) {
  const cleaned = (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned ? `@${cleaned}` : '@user';
}

function getFollowSummary({ followersCount, followingCount }) {
  const formatCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`;
    }
    return `${count}`;
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
