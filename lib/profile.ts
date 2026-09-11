export function getDisplayName(user: { name?: string | null; username?: string | null }) {
  return user.username?.trim() || user.name?.trim() || "Unknown user";
}

export function getProfileHandle(value: string) {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned ? `@${cleaned}` : "@user";
}

export function getFollowSummary({ followersCount, followingCount }: { followersCount: number; followingCount: number }) {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;
    }
    return `${count}`;
  };

  return {
    followersLabel: `${formatCount(followersCount)} followers`,
    followingLabel: `${formatCount(followingCount)} following`,
  };
}
