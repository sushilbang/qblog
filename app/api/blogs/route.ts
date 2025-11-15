import { getAllBlogs } from '@/lib/firestore-blogs'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('search') || ''

    const offset = (page - 1) * limit

    const { blogs, total } = await getAllBlogs(limit, offset, search || undefined)

    return Response.json({
      blogs: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        query: blog.query,
        createdAt: blog.createdAt,
        imageUrl: blog.imageUrl,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return Response.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
