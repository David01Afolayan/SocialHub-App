"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import CommentSection from "@/components/comments/CommentSection"
import PostActions from "@/components/posts/PostActions"
import PostContent from "@/components/posts/PostContent"

type Post = {
  id: string
  content: string | null
  mediaUrls: string[]
  createdAt: string
  author: { id: string; name: string | null; username: string | null; image: string | null }
  _count: { likes: number; comments: number; bookmarks: number; reposts: number }
  liked: boolean
  bookmarked: boolean
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    void (async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/v1/posts/${id}`)
        const body = await response.json()
        if (!response.ok) throw new Error(body.error?.message ?? body.error ?? "Post not found")
        setPost(body.data ?? body)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load post")
      }
    })()
  }, [params])

  if (error) return <main className="mx-auto max-w-2xl p-8 text-center"><p className="text-red-500">{error}</p><Link href="/" className="mt-4 inline-block text-blue-500">Back to home</Link></main>
  if (!post) return <main className="mx-auto max-w-2xl p-8 text-center">Loading post...</main>

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90"><Link href="/" className="text-sm font-semibold hover:text-blue-500">← Back</Link><h1 className="mt-2 text-xl font-bold">Post</h1></header>
      <article className="p-5">
        <div className="flex gap-3">
          {post.author.image ? <img src={post.author.image} alt={post.author.name ?? "User"} className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-bold dark:bg-gray-800">{(post.author.name ?? "U").charAt(0).toUpperCase()}</div>}
          <div><p className="font-bold">{post.author.name ?? "User"}</p>{post.author.username && <p className="text-sm text-gray-500">@{post.author.username}</p>}</div>
        </div>
        {post.content && <div className="mt-5 text-lg leading-8"><PostContent content={post.content} /></div>}
        {post.mediaUrls?.length > 0 && <div className="mt-5 grid gap-3">{post.mediaUrls.map((url, index) => <img key={`${url}-${index}`} src={url} alt="Post media" className="max-h-[700px] w-full rounded-2xl object-cover" />)}</div>}
        <time className="mt-5 block text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</time>
        <PostActions
          postId={post.id}
          liked={post.liked}
          bookmarked={post.bookmarked}
          likeCount={post._count.likes}
          repostCount={post._count.reposts}
          commentCount={post._count.comments}
        />
      </article>
      <CommentSection postId={post.id} />
    </main>
  )
}
