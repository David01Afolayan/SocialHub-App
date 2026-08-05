"use client"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

export default function Home() {
  const { data: session } = useSession()
  const [post, setPost] = useState("")

  const handlePost = async () => {
    if (!post) return
    alert("Posting: " + post) // We'll connect this to DB next
    setPost("")
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SocialHub</h1>
        <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
          Sign Out
        </button>
      </div>

      {session ? (
        <>
          <p className="mb-4">Welcome {session.user?.name}!</p>
          
          {/* CREATE POST BOX */}
          <div className="border p-4 rounded-lg mb-6">
            <textarea 
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border p-2 rounded mb-2"
              rows={3}
            />
            <button 
              onClick={handlePost}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </div>

          {/* FEED PLACEHOLDER */}
          <div className="border p-4 rounded-lg">
            <p>Your feed will show up here</p>
          </div>
        </>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  )
}