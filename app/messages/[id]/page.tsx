import { auth } from "@/auth"
import MessageComposer from "@/components/chat/MessageComposer"
import MessageList from "@/components/chat/MessageList"

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return null
  const { id } = await params
  return (
    <main className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col border-x">
      <header className="border-b p-4"><h1 className="font-semibold">Messages</h1></header>
      <MessageList conversationId={id} currentUserId={session.user.id} />
      <MessageComposer conversationId={id} />
    </main>
  )
}
