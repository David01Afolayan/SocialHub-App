"use client"

type PostCardProps = {
  post: any
  currentUserId?: string
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
}

export default function PostCard({ post, onLike, onBookmark }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {post.author?.image ? (
          <img src={post.author.image} alt={post.author?.name || "User"} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
            {(post.author?.name || post.author?.username || "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900">{post.author?.name || post.author?.username || "User"}</p>
          {post.author?.username ? <p className="text-sm text-slate-500">@{post.author.username}</p> : null}
        </div>
      </div>
      {post.content ? <p className="mt-4 whitespace-pre-wrap text-slate-700">{post.content}</p> : null}
      <div className="mt-4 flex gap-4 text-sm text-slate-600">
        <button onClick={() => onLike?.(post.id)}>Like {post._count?.likes ?? post.likeCount ?? 0}</button>
        <button>Comments {post._count?.comments ?? post.commentCount ?? 0}</button>
        <button onClick={() => onBookmark?.(post.id)}>Bookmark</button>
      </div>
    </article>
  )
}
