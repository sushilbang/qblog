export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create a highly detailed and optimized prompt for banner generation
    const enhancedPrompt = `
      A stunning, professional blog banner about "${prompt}".
      Ultra high quality, 4K resolution, cinematic lighting, vibrant colors.
      Modern minimalist design with perfect composition.
      Wide landscape format (16:9 aspect ratio) banner image.
      Sharp focus, professional photography style, magazine cover quality.
      Trending on ArtStation, detailed, intricate, beautiful, clean aesthetic.
      No text, no watermarks, sharp details, perfect lighting, color graded.
      Masterpiece, award-winning photography, highly detailed and polished.
    `.replace(/\n/g, ' ').trim()

    // Use Pollinations.ai - completely free, no authentication needed
    // Create a deterministic seed based on the prompt for consistency
    let seed = 0
    for (let i = 0; i < prompt.length; i++) {
      seed += prompt.charCodeAt(i)
    }
    seed = Math.abs(seed % 1000000)

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&seed=${seed}`

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Image generation error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
