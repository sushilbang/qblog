import { getBlog, updateBlog } from '@/lib/firestore-blogs'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get the current blog
    const blog = await getBlog(id)

    if (!blog) {
      return Response.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Generate new image using the blog's query/topic
    let imageUrl: string | null = null
    try {
      const imageResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: blog.query }),
        }
      )

      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        imageUrl = imageData.imageUrl
      } else {
        console.error('Failed to regenerate image:', imageResponse.statusText)
        return Response.json(
          { error: 'Failed to generate image' },
          { status: 500 }
        )
      }
    } catch (imageError) {
      console.error('Image regeneration error:', imageError)
      return Response.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    // Update blog with new image
    const updatedBlog = await updateBlog(id, { imageUrl })

    return Response.json(updatedBlog)
  } catch (error) {
    console.error('Error regenerating image:', error)
    return Response.json(
      { error: 'Failed to regenerate image' },
      { status: 500 }
    )
  }
}
