import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const blog = await prisma.blog.findUnique({
      where: { id },
    })

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

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData,
    })

    return Response.json(blog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return Response.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}
