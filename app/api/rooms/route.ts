import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const { blogId, content, title } = await request.json()
    const roomId = Math.random().toString(36).substr(2, 9)

    // Create room in Firestore with blog content
    await setDoc(doc(db, 'collaborativeRooms', roomId), {
      id: roomId,
      blogId,
      content: content || '',
      title: title || '',
      connectedUsers: [],
      userCursors: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ roomId, blogId })
  } catch (error) {
    console.error('Error creating room:', error)
    return Response.json({ error: 'Failed to create room', details: String(error) }, { status: 500 })
  }
}
