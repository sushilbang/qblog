import { claimUnsignedBlogs } from '@/lib/firestore-blogs'
import { headers } from 'next/headers'

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const ipAddress = getIpAddress()

    if (!ipAddress) {
      return new Response(
        JSON.stringify({
          error: 'Unable to determine IP address',
          claimedCount: 0
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const claimedCount = await claimUnsignedBlogs(userId, ipAddress)

    return new Response(
      JSON.stringify({
        success: true,
        claimedCount,
        message: claimedCount > 0
          ? `Successfully claimed ${claimedCount} blog(s) created before sign-up!`
          : 'No unsigned blogs found to claim'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error claiming blogs:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to claim blogs' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
