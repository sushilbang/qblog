import { getAuth } from 'firebase-admin/auth'
import { adminDb } from '@/lib/firebase-admin'
import { saveCustomPrompt, getCustomPrompt } from '@/lib/firestore-prompts'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const prompt = await getCustomPrompt(userId)

    return new Response(
      JSON.stringify({ prompt: prompt || null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching custom prompt:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch custom prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, prompt } = body

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'prompt cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await saveCustomPrompt(userId, prompt)

    return new Response(
      JSON.stringify({ success: true, prompt }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error saving custom prompt:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save custom prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Delete the custom prompt document
    await adminDb.collection('custom_prompts').doc(userId).delete()

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting custom prompt:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete custom prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
