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
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    let fullContent = ''

    // Create a readable stream that handles the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
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

          // Stream the text as it comes in
          for await (const chunk of textStream) {
            fullContent += chunk
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(`data: ${data}\n\n`)
          }

          // Save the blog to database
          if (fullContent.trim()) {
            const title = extractTitleFromContent(fullContent)
            const ipAddress = getIpAddress()
            const userAgent = getUserAgent()

            try {
              await prisma.blog.create({
                data: {
                  title,
                  content: fullContent,
                  query,
                  ipAddress,
                  userAgent,
                  metadata: JSON.stringify({
                    contentLength: fullContent.length,
                    wordCount: fullContent.split(/\s+/).length,
                  }),
                },
              })
            } catch (dbError) {
              console.error('Database error:', dbError)
              // Continue even if database save fails
            }
          }

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          controller.enqueue(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
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
