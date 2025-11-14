# qBlog - Minimalistic AI Blog Generator

A minimalistic, black and white blog generator powered by Groq AI and Next.js. Generate beautiful, well-structured blog posts instantly with a clean, typography-focused design.

## Features

- **🚀 Real-time Streaming**: Generate blogs with live streaming using Groq + Vercel AI SDK
- **🎨 Minimalistic Design**: Clean black and white aesthetic with dark mode support
- **📱 Responsive**: Mobile-friendly design with Tailwind CSS
- **💾 Database Storage**: Store all generated blogs in PostgreSQL or SQLite
- **🔍 Search & Filter**: Search through your generated blogs
- **📋 Blog History**: Gallery view of all generated blogs with pagination
- **🎯 Metadata**: Track creation time, IP, user agent, and content statistics
- **📤 Share & Copy**: Built-in share and copy-to-clipboard functionality
- **⌨️ Markdown Rendering**: Properly styled markdown with code highlighting

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite (development) / PostgreSQL (production)
- **AI**: Groq API + Vercel AI SDK
- **Icons**: Lucide React
- **Markdown**: react-markdown
- **Theme**: next-themes

## Prerequisites

- Node.js 18+ and npm/yarn
- Groq API key (get one at [groq.com](https://console.groq.com))
- PostgreSQL database (optional, SQLite works for development)

## Installation

### 1. Clone or set up the project

```bash
cd qblog
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Database URL
# For SQLite (development):
DATABASE_URL="file:./prisma/dev.db"

# For PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/qblog"
```

### 3. Set up the database

Initialize Prisma and create the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the SQLite database (or connect to PostgreSQL)
- Run migrations
- Generate Prisma Client

### 4. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog generator!

## Usage

### Generate a Blog

1. Go to the homepage
2. Enter a blog topic or question in the input field
3. Click "Generate Blog"
4. Watch as the blog is generated in real-time with streaming
5. Copy the markdown or share it directly

### View Blog History

1. Click "View all" from the homepage or navigate to `/blogs`
2. Browse your generated blogs in the gallery view
3. Use the search bar to find specific blogs
4. Click on any blog to view the full post with metadata

### Dark Mode

- Use the theme toggle button in the top right corner
- Your preference is saved automatically

## Project Structure

```
qblog/
├── app/
│   ├── layout.tsx                 # Root layout with theme provider
│   ├── page.tsx                   # Homepage with generator
│   ├── globals.css                # Global styles and markdown styling
│   ├── providers.tsx              # Next-themes provider
│   ├── api/
│   │   ├── generate/route.ts      # Blog generation endpoint (streaming)
│   │   └── blogs/
│   │       ├── route.ts           # Fetch blogs list with search
│   │       └── [id]/route.ts      # Fetch single blog
│   └── blogs/
│       ├── page.tsx               # Blog gallery/history page
│       └── [id]/page.tsx          # Individual blog view
├── components/
│   ├── ThemeToggle.tsx            # Dark/light mode toggle
│   ├── BlogGenerator.tsx          # Main blog generator form
│   ├── MarkdownRenderer.tsx       # Styled markdown display
│   ├── BlogCard.tsx               # Blog preview card
│   └── BlogList.tsx               # Blog list container
├── lib/
│   ├── db.ts                      # Prisma client
│   └── utils.ts                   # Utility functions
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── dev.db                     # SQLite database (generated)
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## API Routes

### POST `/api/generate`

Generate a blog post with streaming response.

**Request:**
```json
{
  "query": "How to build a Next.js app"
}
```

**Response:** Server-sent events (SSE) stream with blog content chunks

### GET `/api/blogs`

Fetch paginated list of blogs with optional search.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search query (searches title, content, and original query)

**Response:**
```json
{
  "blogs": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "query": "...",
      "createdAt": "..."
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### GET `/api/blogs/[id]`

Fetch a single blog by ID.

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "content": "...",
  "query": "...",
  "ipAddress": "...",
  "userAgent": "...",
  "createdAt": "...",
  "metadata": {
    "contentLength": 5234,
    "wordCount": 892
  }
}
```

## Database Schema

The `Blog` model stores:

- `id` - Unique identifier (CUID)
- `title` - Extracted from first heading
- `content` - Full markdown content
- `query` - Original user input
- `ipAddress` - User's IP address (for analytics)
- `userAgent` - Browser/device information
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `metadata` - JSON field for additional data (content length, word count, etc.)

## Customization

### Adjust AI Model

Edit `/app/api/generate/route.ts`:

```typescript
const response = streamText({
  model: groq('llama-3.3-70b-versatile'), // Change model here
  // ...
})
```

Available Groq models:
- `llama-3.3-70b-versatile` (recommended)
- `llama-3.1-405b-reasoning`
- `mixtral-8x7b-32768`

### Modify System Prompt

Edit the `systemPrompt` variable in `/app/api/generate/route.ts` to change blog generation behavior.

### Customize Styling

- **Theme colors**: Edit CSS variables in `/app/globals.css`
- **Tailwind**: Configure in `tailwind.config.ts`
- **Markdown styling**: Adjust styles in `.markdown-content` in `/app/globals.css`

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `GROQ_API_KEY`
   - `DATABASE_URL` (if using PostgreSQL)
4. Deploy!

### Using PostgreSQL in Production

1. Set up a PostgreSQL database (e.g., on Heroku, AWS RDS, Railway)
2. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@host:port/qblog"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Performance Tips

- Use PostgreSQL for production (SQLite is for development)
- Enable caching on the `/api/blogs` endpoint
- Consider adding database indexes for frequently searched fields
- Use a CDN for static assets

## Troubleshooting

### "GROQ_API_KEY is not set"

Make sure you've added your Groq API key to `.env.local`

### Database connection errors

Check that your `DATABASE_URL` is correct and the database server is running.

For SQLite:
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Streaming stops unexpectedly

Check browser console for errors. Ensure:
- API key is valid
- Groq API is accessible
- Network connection is stable

### Markdown not rendering properly

Clear your browser cache and rebuild:
```bash
npm run build
```

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

- 📧 For issues, check the GitHub repository
- 🐛 Report bugs with detailed steps to reproduce
- 💡 Suggest features via GitHub discussions

## Changelog

### v0.1.0
- Initial release
- Blog generation with Groq streaming
- Dark/light mode toggle
- Blog history and search
- Responsive design
- Database storage with Prisma

---

Made with ❤️ using Next.js and Groq AI
