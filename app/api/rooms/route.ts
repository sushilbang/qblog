import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const { blogId } = await request.json()
    const roomId = Math.random().toString(36).substr(2, 9)

    // Get the blog content to pre-populate the room
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const blogResponse = await fetch(`${baseUrl}/api/blogs/${blogId}`)
    const blog = await blogResponse.json()

    // Create room in Firestore with blog content
    await setDoc(doc(db, 'collaborativeRooms', roomId), {
      id: roomId,
      blogId,
      content: blog.content || '',
      title: blog.title || '',
      connectedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ roomId, blogId })
  } catch (error) {
    console.error('Error creating room:', error)
    return Response.json({ error: 'Failed to create room' }, { status: 500 })
  }
}
