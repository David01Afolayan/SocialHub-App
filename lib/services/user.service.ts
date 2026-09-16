import {
  findUserByEmail,
  findUserById,
  findUserByUsername,
} from "@/lib/repositories/user.repository"

export async function getUserById(id: string) {
  return findUserById(id)
}

export async function getUserByUsername(username: string) {
  return findUserByUsername(username.toLowerCase())
}

export async function getUserByEmail(email: string) {
  return findUserByEmail(email.toLowerCase())
}
