function buildNotificationMessage({ type, actorName }) {
  if (!actorName) return 'Someone';

  const map = {
    like: `${actorName} liked your post`,
    comment: `${actorName} commented on your post`,
    follow: `${actorName} followed you`,
  };

  return map[type] ?? `${actorName} interacted with you`;
}

module.exports = {
  buildNotificationMessage,
};
