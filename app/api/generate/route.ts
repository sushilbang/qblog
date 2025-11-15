import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { prisma } from '@/lib/db'
import { extractTitleFromContent } from '@/lib/utils'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

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

function getUserAgent(): string | null {
  try {
    const headersList = headers()
    return headersList.get('user-agent')
  } catch (error) {
    console.error('Error getting user agent:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string' || !query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid query' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY is not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const ipAddress = getIpAddress()
    const userAgent = getUserAgent()

    // Create blog record immediately with empty content
    let blog
    try {
      blog = await prisma.blog.create({
        data: {
          title: 'Generating...',
          content: '',
          query,
          ipAddress,
          userAgent,
          metadata: JSON.stringify({
            contentLength: 0,
            wordCount: 0,
          }),
        },
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to create blog record' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Return blog ID immediately to client
    const response = new Response(
      JSON.stringify({ id: blog.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    // Generate content and image in background (fire and forget)
    generateBlogContent(blog.id, query, ipAddress, userAgent).catch((error) => {
      console.error('Background generation error:', error)
    })

    return response
  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Background function to generate content and update blog
async function generateBlogContent(
  blogId: string,
  query: string,
  ipAddress: string | null,
  userAgent: string | null
) {
  try {
    const systemPrompt = `You are an expert blog writer. Generate a well-structured, engaging blog post in markdown format based on the user's query.

Requirements:
- Start with a main title (h1)
- Include an introduction paragraph
- Use proper markdown headings (h2, h3) for sections
- Write comprehensive paragraphs with good spacing
- Include bullet points or numbered lists where appropriate
- Add a conclusion section
- Use code blocks with syntax highlighting when relevant
- Ensure the content is informative and well-organized
- Write in a clear, professional tone
- Format the entire response as valid markdown`

    const userMessage = `Write a detailed blog post about: ${query}`

    // Create Groq client with OpenAI-compatible endpoint
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    const { textStream } = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    })

    let fullContent = ''

    // Collect all streamed content
    for await (const chunk of textStream) {
      fullContent += chunk
    }

    // Extract title from content
    const title = extractTitleFromContent(fullContent)

    // Generate image
    let imageUrl: string | null = null
    try {
      const imageResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: query }),
        }
      )

      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        imageUrl = imageData.imageUrl
      } else {
        console.error('Failed to generate image:', imageResponse.statusText)
      }
    } catch (imageError) {
      console.error('Image generation error:', imageError)
      // Continue even if image generation fails
    }

    // Update blog with generated content and image
    await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        content: fullContent,
        imageUrl,
        metadata: JSON.stringify({
          contentLength: fullContent.length,
          wordCount: fullContent.split(/\s+/).length,
        }),
      },
    })
  } catch (error) {
    console.error('Background generation error:', error)
    // Try to update blog with error message
    try {
      await prisma.blog.update({
        where: { id: blogId },
        data: {
          title: 'Generation Failed',
          content: 'Failed to generate blog content. Please try again.',
        },
      })
    } catch (updateError) {
      console.error('Failed to update blog with error:', updateError)
    }
  }
}
