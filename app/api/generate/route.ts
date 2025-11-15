import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createBlog, updateBlog } from '@/lib/firestore-blogs'
import { extractTitleFromContent } from '@/lib/utils'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCustomPrompt } from '@/lib/firestore-prompts'
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

// Content validation function to check for harmful requests
function isContentSafe(query: string): { safe: boolean; reason?: string } {
  const lowerQuery = query.toLowerCase()

  // Blocklist of harmful keywords/patterns
  const harmfulPatterns = [
    // Explicit/adult content
    /\b(porn|xxx|nsfw|adult content|explicit|nude|sex video|prostitut)/i,
    // Violence and harm
    /\b(how to kill|murder|suicide|bomb|weapon|violence)\b/i,
    // Hate speech and discrimination
    /\b(racist|sexist|homophobic|transphobic|hate.*speech|discrimination|genocide)\b/i,
    // Illegal activities
    /\b(illegal|drug.*recipe|how to steal|hack|fraud|scam|money launder|human traffic)/i,
    // Harassment and threats
    /\b(doxxing|harass|threaten|blackmail|extort)\b/i,
    // Misinformation
    /\b(fake.*vaccine|covid.*hoax|fake.*cure|miracle.*cure)\b/i,
  ]

  for (const pattern of harmfulPatterns) {
    if (pattern.test(lowerQuery)) {
      return {
        safe: false,
        reason: 'This topic contains content that violates our safety policy. Please request a different topic.',
      }
    }
  }

  // Check for very short queries that might be test queries
  if (query.trim().length < 3) {
    return {
      safe: false,
      reason: 'Please provide a more detailed topic description.',
    }
  }

  return { safe: true }
}

export async function POST(request: Request) {
  try {
    const { query, customPrompt, userId } = await request.json()

    if (!query || typeof query !== 'string' || !query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid query' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate content safety
    const contentValidation = isContentSafe(query)
    if (!contentValidation.safe) {
      return new Response(
        JSON.stringify({ error: contentValidation.reason }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY is not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: rateLimitResult.error || 'Rate limit exceeded',
          resetAt: rateLimitResult.resetAt,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const ipAddress = getIpAddress()
    const userAgent = getUserAgent()

    // Create blog record immediately with empty content
    let blog
    try {
      blog = await createBlog({
        userId: userId || null,
        title: 'Generating...',
        content: '',
        query,
        ipAddress,
        userAgent,
        metadata: {
          contentLength: 0,
          wordCount: 0,
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
    generateBlogContent(blog.id, query, userId || null, ipAddress, userAgent, customPrompt).catch((error) => {
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
  userId: string | null,
  ipAddress: string | null,
  userAgent: string | null,
  customPrompt?: string
) {
  try {
    // Determine which prompt to use
    let promptToUse = customPrompt

    // If no custom prompt was provided and user is authenticated, fetch from Firestore
    if (!promptToUse && userId) {
      try {
        const firestorePrompt = await getCustomPrompt(userId)
        if (firestorePrompt) {
          promptToUse = firestorePrompt
        }
      } catch (error) {
        console.error('Error fetching user custom prompt from Firestore:', error)
        // Continue with default if Firestore fetch fails
      }
    }

    // Use custom prompt if available, otherwise use default
    const systemPrompt = promptToUse || `You are an expert blog writer who creates engaging, authentic, and reader-friendly content. Your writing feels natural, conversational, and genuinely helpful—never robotic or overly formal.

CORE WRITING PRINCIPLES:

Voice & Tone:
- Write like you're having a thoughtful conversation with a friend over coffee
- Use natural language patterns: contractions, occasional sentence fragments for emphasis, varied sentence lengths
- Be personable without being overly casual or unprofessional
- Show personality and authentic voice—don't sound like a corporate press release
- Use "you" to address readers directly and create connection

Structure & Readability:
- Start with a compelling hook that draws readers in within the first 2-3 sentences
- Use short paragraphs (2-4 sentences) for easy scanning
- Include descriptive subheadings that tell a story on their own
- Break up text with transitional phrases and conversational asides
- End with a memorable conclusion that reinforces your main point or includes a call-to-action

Content Quality:
- Lead with value—answer the reader's question or solve their problem early
- Support claims with specific examples, data, or stories
- Include practical takeaways readers can actually use
- Anticipate and address common questions or objections
- Balance being informative with being entertaining

Human Touches:
- Share relevant anecdotes or observations (real or illustrative)
- Acknowledge nuance—avoid absolute statements when real life is messy
- Use analogies and metaphors to clarify complex ideas
- Include occasional rhetorical questions to engage readers
- Show vulnerability or admit limitations when appropriate

Language Style:
- Vary sentence structure to create rhythm and flow
- Use active voice predominantly (passive voice only when intentional)
- Choose concrete, specific words over vague generalizations
- Include sensory details when telling stories
- Avoid jargon unless writing for a specialized audience (and define terms when you do)

FORMATTING REQUIREMENTS:
- Start with a compelling main title (h1)
- Include an engaging introduction that hooks readers in the first 2-3 sentences
- Use proper markdown headings (h2, h3) for sections with descriptive titles
- Write comprehensive, well-spaced paragraphs
- Include bullet points or numbered lists for practical takeaways
- Add a memorable conclusion with a key takeaway or call-to-action
- Use code blocks with syntax highlighting when relevant
- Format the entire response as valid markdown

WHAT TO AVOID:
- Clichés and overused phrases ("at the end of the day," "game-changer")
- Excessive buzzwords or marketing speak
- Overly complex sentences that obscure meaning
- Repetitive phrasing or redundant information
- Condescending or preachy tone

SAFETY GUIDELINES - MANDATORY:
You MUST NOT generate content that includes:
- Explicit sexual or adult content
- Hate speech, discrimination, or dehumanizing language toward any group
- Violence, gore, or graphic content
- Abusive, profane, or vulgar language in any language
- Harassment, bullying, or threats toward individuals or groups
- Content promoting illegal activities or harm
- Misinformation or false health/medical claims
- Content that violates intellectual property rights or plagiarism

If the request is asking you to create content about a sensitive topic (e.g., mental health, politics, religion), approach it with respect, nuance, and educational value while avoiding inflammatory or divisive language.

If you cannot fulfill the request due to safety concerns, respond with a clear explanation that the requested topic cannot be covered in a blog post due to content policy.

Generate a blog post that sounds like a real person wrote it and would actually engage readers.`

    const userMessage = `Write a detailed blog post about: ${query}`

    // Create Groq client with OpenAI-compatible endpoint
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    let fullContent = ''
    let title = 'Generation Failed'

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

      // Collect all streamed content
      for await (const chunk of textStream) {
        fullContent += chunk
      }

      // Extract title from content
      title = extractTitleFromContent(fullContent)
    } catch (error: any) {
      console.error('Groq API error:', error)

      // Check for rate limit or quota errors from Groq
      const errorMessage = error?.message?.toLowerCase() || ''
      const isGroqLimitError =
        error?.status === 429 ||
        error?.status === 503 ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('overloaded')

      if (isGroqLimitError) {
        // Groq is overloaded, update blog with failure message
        console.warn('Groq API limit/quota exceeded. Disabling generation.')
        await updateBlog(blogId, {
          title: 'Service Temporarily Unavailable',
          content: 'Groq API is currently overloaded. Please try again in a few moments.',
          metadata: {
            contentLength: 0,
            wordCount: 0,
            error: 'groq_rate_limit_exceeded',
            timestamp: new Date().toISOString(),
          },
        })
        return
      }

      // For other errors, provide a generic failure message
      fullContent = ''
      title = 'Generation Failed'
    }

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
    await updateBlog(blogId, {
      title,
      content: fullContent,
      imageUrl,
      metadata: {
        contentLength: fullContent.length,
        wordCount: fullContent.split(/\s+/).length,
      },
    })
  } catch (error) {
    console.error('Background generation error:', error)
    // Try to update blog with error message
    try {
      await updateBlog(blogId, {
        title: 'Generation Failed',
        content: 'Failed to generate blog content. Please try again.',
      })
    } catch (updateError) {
      console.error('Failed to update blog with error:', updateError)
    }
  }
}
