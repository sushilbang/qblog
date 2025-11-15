import { getBlog, updateBlog } from '@/lib/firestore-blogs'
import { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const blog = await getBlog(id)

    if (!blog) {
      return Response.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return Response.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return Response.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Get and verify the authorization token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized: Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    let userId: string

    try {
      const decodedToken = await adminAuth.verifyIdToken(token)
      userId = decodedToken.uid
    } catch (err) {
      console.error('Token verification failed:', err)
      return Response.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      )
    }

    // Fetch the blog
    const blog = await getBlog(id)
    if (!blog) {
      return Response.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check authorization - user must be the blog owner
    if (blog.userId !== userId) {
      return Response.json(
        { error: 'Forbidden: You can only edit your own blogs' },
        { status: 403 }
      )
    }

    // Allow updating imageUrl, content, and title
    const { imageUrl, content, title } = body

    // Build update object with only provided fields
    const updateData: any = {}

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || !content.trim()) {
        return Response.json(
          { error: 'Content cannot be empty' },
          { status: 400 }
        )
      }
      updateData.content = content
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return Response.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      updateData.title = title
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const updatedBlog = await updateBlog(id, updateData)

    return Response.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return Response.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}
