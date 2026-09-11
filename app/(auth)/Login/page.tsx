import { redirect } from "next/navigation"

export default function LoginRoot() {
  redirect('/login/register')
}