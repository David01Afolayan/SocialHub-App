import Link from "next/link"

export default function PostContent({ content }: { content: string }) {
  const parts = content.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/)
  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-6">
      {parts.map((part, index) => {
        if (part.startsWith("#")) {
          return <Link key={index} href={`/explore?q=${encodeURIComponent(part.slice(1))}&type=HASHTAGS`} className="text-blue-500 hover:underline">{part}</Link>
        }
        if (part.startsWith("@")) {
          return <Link key={index} href={`/profile/${part.slice(1)}`} className="text-blue-500 hover:underline">{part}</Link>
        }
        return <span key={index}>{part}</span>
      })}
    </p>
  )
}
