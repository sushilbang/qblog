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
