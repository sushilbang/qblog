import { adminDb } from './firebase-admin'
import * as admin from 'firebase-admin'
import { headers } from 'next/headers'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  error?: string
}

function getIpAddress(): string | null {
  try {
    const headersList = headers()
    const forwarded = headersList.get('x-forwarded-for')
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    const realIp = headersList.get('x-real-ip')
    if (realIp) {
      return realIp
    }
    return null
  } catch (error) {
    console.error('Error getting IP address:', error)
    return null
  }
}

export async function checkRateLimit(userId?: string): Promise<RateLimitResult> {
  try {
    if (!userId) {
      // Unsigned user - rate limit by IP address
      return await checkUnsignedUserLimit()
    } else {
      // Signed-in user - rate limit by user ID
      return await checkSignedUserLimit(userId)
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: -1,
      resetAt: new Date(),
      error: 'Rate limit check failed, allowing request',
    }
  }
}

async function checkUnsignedUserLimit(): Promise<RateLimitResult> {
  const ipAddress = getIpAddress()
  if (!ipAddress) {
    // If we can't get IP, allow the request
    return {
      allowed: true,
      remaining: 5,
      resetAt: new Date(),
    }
  }

  const now = new Date()
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const docId = `ip_${ipAddress}_${now.toISOString().split('T')[0]}_${Math.floor(now.getHours())}`

  const rateLimitRef = adminDb.collection('rate_limits').doc(docId)
  const doc = await rateLimitRef.get()

  const limit = 5 // 5 blogs per hour for unsigned users
  let count = 0
  let resetAt = new Date(now.getTime() + 60 * 60 * 1000)

  if (doc.exists) {
    const data = doc.data()
    if (data) {
      count = data.count || 0
      resetAt = data.resetAt?.toDate() || resetAt
    }
  }

  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      error: `Rate limit exceeded. You can generate ${limit} blogs per hour. Try again in ${Math.ceil((resetAt.getTime() - now.getTime()) / 60000)} minutes.`,
    }
  }

  // Increment counter
  const firstRequestAt = doc.exists && doc.data() ? doc.data()!.firstRequestAt : admin.firestore.Timestamp.now()
  await rateLimitRef.set(
    {
      count: count + 1,
      ipAddress,
      firstRequestAt,
      lastRequestAt: admin.firestore.Timestamp.now(),
      resetAt: admin.firestore.Timestamp.fromDate(resetAt),
    },
    { merge: true }
  )

  return {
    allowed: true,
    remaining: limit - count - 1,
    resetAt,
  }
}

async function checkSignedUserLimit(userId: string): Promise<RateLimitResult> {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const docId = `user_${userId}_${today}`

  const rateLimitRef = adminDb.collection('rate_limits').doc(docId)
  const doc = await rateLimitRef.get()

  const limit = 50 // 50 blogs per day for signed-in users
  let count = 0
  let resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  if (doc.exists) {
    const data = doc.data()
    if (data) {
      count = data.count || 0
      resetAt = data.resetAt?.toDate() || resetAt
    }
  }

  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      error: `Daily limit reached. You can generate ${limit} blogs per day. Try again tomorrow.`,
    }
  }

  // Increment counter
  const userFirstRequestAt = doc.exists && doc.data() ? doc.data()!.firstRequestAt : admin.firestore.Timestamp.now()
  await rateLimitRef.set(
    {
      count: count + 1,
      userId,
      firstRequestAt: userFirstRequestAt,
      lastRequestAt: admin.firestore.Timestamp.now(),
      resetAt: admin.firestore.Timestamp.fromDate(resetAt),
    },
    { merge: true }
  )

  return {
    allowed: true,
    remaining: limit - count - 1,
    resetAt,
  }
}
