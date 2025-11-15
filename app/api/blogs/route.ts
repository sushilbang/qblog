import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    let whereClause: any = {
      // Only include blogs that have been generated (not empty content)
      content: { not: '' },
      title: { not: 'Generating...' },
    }

    if (search) {
      whereClause = {
        AND: [
          { content: { not: '' } },
          { title: { not: 'Generating...' } },
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { query: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      }
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          query: true,
          createdAt: true,
        },
      }),
      prisma.blog.count({ where: whereClause }),
    ])

    return Response.json({
      blogs,
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
