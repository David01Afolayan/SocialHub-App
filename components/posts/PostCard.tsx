"use client"

import Link from "next/link"
import PostActions from "@/components/posts/PostActions"
import PostContent from "@/components/posts/PostContent"

type PostCardProps = {
  post: {
    id: string
    content: string | null
    mediaUrl?: string | null
    mediaUrls?: string[]
    createdAt: string | Date
    author: {
      id: string
      name: string | null
      username: string | null
      image: string | null
    }
    _count?: {
      likes: number
      comments: number
      bookmarks: number
      reposts: number
    }
    liked?: boolean
    bookmarked?: boolean
  }
}

export default function PostCard({ post }: PostCardProps) {
  const profileHref = post.author.username ? `/profile/${post.author.username}` : "#"

  return (
    <article className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex gap-3">
        <Link href={profileHref} aria-label={`View ${post.author.name ?? "user"} profile`}>
          {post.author.image ? (
            <img src={post.author.image} alt={post.author.name ?? "User"} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-bold dark:bg-gray-800">
              {(post.author.name ?? "U").charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link href={profileHref} className="font-semibold hover:underline">{post.author.name ?? "User"}</Link>
            {post.author.username && <span className="text-sm text-gray-500">@{post.author.username}</span>}
          </div>
          <time className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</time>
          {post.content && <div className="mt-3"><PostContent content={post.content} /></div>}
          {(post.mediaUrls?.length ?? 0) > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {post.mediaUrls?.map((url, index) => (
                <img key={`${url}-${index}`} src={url} alt="Post media" className="max-h-[500px] w-full rounded-xl object-cover" />
              ))}
            </div>
          )}
          <PostActions
            postId={post.id}
            liked={post.liked ?? false}
            bookmarked={post.bookmarked ?? false}
            likeCount={post._count?.likes ?? 0}
            repostCount={post._count?.reposts ?? 0}
            commentCount={post._count?.comments ?? 0}
          />
        </div>
      </div>
    </article>
  )
}
