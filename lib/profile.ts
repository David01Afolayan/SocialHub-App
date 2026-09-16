export function getDisplayName(user: { name?: string | null; username?: string | null } | null | undefined) {
  if (!user || typeof user !== "object") return "Unknown user";

  const username = typeof user.username === "string" ? user.username.trim() : "";
  const name = typeof user.name === "string" ? user.name.trim() : "";

  return username || name || "Unknown user";
}

export function getProfileHandle(value: string | null | undefined) {
  const cleaned = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned ? `@${cleaned}` : "@user";
}

export function getFollowSummary({ followersCount = 0, followingCount = 0 }: { followersCount?: number; followingCount?: number } = {}) {
  const formatCount = (count: number = 0) => {
    const safeCount = Number.isFinite(count) ? count : 0;

    if (safeCount >= 1000) {
      return `${(safeCount / 1000).toFixed(safeCount >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;
    }
    return `${safeCount}`;
  };

  return {
    followersLabel: `${formatCount(followersCount)} followers`,
    followingLabel: `${formatCount(followingCount)} following`,
  };
}
