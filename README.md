# NeuralPost - AI-Powered Blog Generation Platform

An intelligent, full-featured blog generation platform powered by Groq AI and Next.js. Generate high-quality blog posts instantly with automatic image generation, customizable AI prompts, user authentication, and multiple theme options.

## Features

- **User Authentication**: Firebase-based email/password authentication with automatic blog claiming from same IP
- **AI-Powered Generation**: Generate blog posts using Groq API (Llama 3.3-70b model) with fire-and-forget architecture
- **Custom AI Prompts**: Create personalized AI system prompts for each user to control blog generation style
- **Automatic Image Generation**: Generate 16:9 featured images (1280x720) using Pollinations.ai
- **Full Blog Editing**: Edit blog titles, content (with markdown toolbar), and regenerate images on-demand
- **Multiple Themes**: Choose from 8 customizable color themes with CSS variables
- **Search & Discovery**: Full-text search across blogs (title, query, content) with pagination
- **Rate Limiting**: Smart rate limiting - 5 blogs/hour for anonymous users, 50 blogs/day for authenticated users
- **Content Safety**: Built-in content validation to prevent generation of harmful content
- **Real-time Status**: Live polling to track blog generation progress
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Share & Copy**: Built-in web share API and copy-to-clipboard functionality
- **Markdown Support**: Full markdown rendering with proper styling and code highlighting

## Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **AI Generation**: Groq API (Llama 3.3-70b model)
- **Image Generation**: Pollinations.ai (free service)
- **Icons**: Lucide React 0.292
- **Markdown**: react-markdown 9.0
- **Theme Management**: next-themes 0.2.1
- **UI**: React 18.3

## Prerequisites

- Node.js 18+ and npm/yarn
- Groq API key (get one at [groq.com](https://console.groq.com))
- Firebase project (Firestore and Authentication enabled)

## Installation

### 1. Clone or set up the project

```bash
cd qblog
npm install
```

### 2. Set up Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database and Firebase Authentication
3. Generate a private key for the service account (Project Settings > Service Accounts > Generate New Private Key)
4. Create a web app in Firebase and get your config

### 3. Set up environment variables

Create a `.env.local` file in the root directory with your credentials:

```env
# Groq API Key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here

# Firebase Client Config (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (server-side only, keep private)
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PROJECT_ID=your_project_id
```

### 4. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog generator!

## Usage

### Generate a Blog

1. Visit the homepage
2. Enter a blog topic or prompt in the input field
3. Click "Generate Blog"
4. The system returns a blog ID immediately and generates content in the background
5. You'll be redirected to the blog detail page where you can monitor generation progress
6. Once complete, view the full blog with featured image, edit content, or regenerate the image

### Customize AI Generation

1. Click "Custom Prompt" in the navigation menu
2. Enter your custom system prompt to control blog generation style
3. Save to persist it to your profile (authenticated users) or localStorage (anonymous users)
4. Your custom prompt will be used for all future blog generations

### Theme Selection

1. Use the theme selector in the navigation menu
2. Choose from 8 available themes: Light, Caramel, Desert, Ocean, Forest, Sunset, Midnight, or Grape
3. Your theme preference is saved automatically

### Authentication

1. Click "Login" in the top right to access your account
2. Sign up with email/password for a new account
3. Authenticated users get:
   - Higher rate limit (50 blogs/day vs 5/hour for anonymous)
   - Personal custom prompts stored in your profile
   - Ownership of generated blogs
   - Automatic claiming of blogs created from your IP address

### View & Manage Blogs

1. Click "Blog Library" to browse all generated blogs
2. Use the search bar to find blogs by title, topic, or content
3. View blog details including featured image, generation date, and reading time
4. Edit blog title and content using the markdown toolbar
5. Regenerate featured images on-demand
6. Share blogs using the web share API or copy to clipboard

## Project Structure

```
qblog/
├── app/
│   ├── layout.tsx                           # Root layout with theme and auth providers
│   ├── page.tsx                             # Homepage with blog generator
│   ├── globals.css                          # Global styles and markdown styling
│   ├── auth-context.tsx                     # Auth state provider
│   ├── api/
│   │   ├── generate/route.ts                # Blog generation endpoint (fire-and-forget)
│   │   ├── generate-image/route.ts          # Image generation endpoint
│   │   ├── blogs/route.ts                   # Fetch paginated blogs with search
│   │   ├── blogs/[id]/route.ts              # Get/update/delete single blog
│   │   ├── blogs/[id]/regenerate-image/route.ts  # Regenerate blog image
│   │   ├── custom-prompt/route.ts           # Get/save/delete custom prompts
│   │   └── claim-blogs/route.ts             # Claim unsigned blogs on login
│   ├── auth/
│   │   ├── login/page.tsx                   # Login page
│   │   └── signup/page.tsx                  # Signup page
│   ├── blogs/
│   │   ├── page.tsx                         # Blog library with search and pagination
│   │   └── [id]/page.tsx                    # Individual blog detail page
│   ├── about/page.tsx                       # About NeuralPost
│   ├── privacy/page.tsx                     # Privacy policy
│   └── terms/page.tsx                       # Terms of service
├── components/
│   ├── BlogGenerator.tsx                    # Main blog generation form
│   ├── BlogCard.tsx                         # Blog preview card for library
│   ├── BlogEditor.tsx                       # Full markdown editor for blogs
│   ├── MarkdownRenderer.tsx                 # Styled markdown renderer
│   ├── CustomPromptModal.tsx                # Custom prompt editor modal
│   ├── ImageBanner.tsx                      # Featured image display with regeneration
│   ├── NavMenu.tsx                          # Navigation menu with auth/theme controls
│   ├── ThemeSelector.tsx                    # Theme selection dropdown
│   ├── ThemeToggle.tsx                      # Light/dark toggle
│   ├── Footer.tsx                           # Global footer
│   └── BlogFooter.tsx                       # Blog-specific footer
├── lib/
│   ├── firebase.ts                          # Firebase client config
│   ├── firebase-admin.ts                    # Firebase Admin SDK (server-side)
│   ├── auth.ts                              # Authentication utilities
│   ├── firestore-blogs.ts                   # Blog database operations
│   ├── firestore-prompts.ts                 # Custom prompt operations
│   ├── rate-limit.ts                        # Rate limiting logic
│   └── utils.ts                             # Utility functions
├── prisma/
│   └── schema.prisma                        # Database schema (not used, kept for reference)
├── public/                                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## API Routes

### POST `/api/generate`

Generate a blog post with fire-and-forget architecture.

**Request:**
```json
{
  "query": "How to build a Next.js app",
  "userId": "optional_user_id"
}
```

**Response:** Returns immediately with blog ID (generation happens in background)
```json
{
  "id": "generated_blog_id",
  "status": "generating"
}
```

**Features:**
- Content validation against harmful patterns
- Rate limiting: 5/hour for anonymous, 50/day for authenticated users
- Validates query length (minimum 3 characters)
- Automatically generates featured image
- Stores IP address and user agent for tracking

### GET `/api/blogs`

Fetch paginated list of blogs with optional search.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 12) - Items per page
- `search` - Full-text search across title, query, and content

**Response:**
```json
{
  "blogs": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "query": "...",
      "imageUrl": "...",
      "createdAt": "...",
      "metadata": {
        "wordCount": 892,
        "contentLength": 5234
      }
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 12,
    "pages": 4
  }
}
```

### GET `/api/blogs/[id]`

Fetch a single blog by ID with full details.

**Response:**
```json
{
  "id": "...",
  "userId": "...",
  "title": "...",
  "content": "...",
  "query": "...",
  "imageUrl": "...",
  "ipAddress": "...",
  "userAgent": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "metadata": {
    "contentLength": 5234,
    "wordCount": 892,
    "error": null
  }
}
```

### PATCH `/api/blogs/[id]`

Update blog title and/or content.

**Request:**
```json
{
  "title": "New Title",
  "content": "# Updated content in markdown"
}
```

**Response:** Updated blog object

**Authorization:** Requires Firebase auth token, user must own the blog

### POST `/api/blogs/[id]/regenerate-image`

Regenerate the featured image for a blog.

**Response:**
```json
{
  "imageUrl": "https://pollinations.ai/...",
  "success": true
}
```

### POST `/api/generate-image`

Generate an image based on a prompt.

**Request:**
```json
{
  "prompt": "A beautiful landscape with mountains"
}
```

**Response:**
```json
{
  "imageUrl": "https://pollinations.ai/..."
}
```

### GET `/api/custom-prompt`

Fetch user's custom prompt for AI generation.

**Query Parameters:**
- `userId` - Firebase user ID

**Response:**
```json
{
  "prompt": "You are a technical blog writer..."
}
```

### POST `/api/custom-prompt`

Save or update user's custom prompt.

**Request:**
```json
{
  "userId": "...",
  "prompt": "Your custom prompt here"
}
```

**Authorization:** Requires Firebase auth token

### DELETE `/api/custom-prompt`

Delete user's custom prompt.

**Query Parameters:**
- `userId` - Firebase user ID

**Authorization:** Requires Firebase auth token

### POST `/api/claim-blogs`

Claim unsigned blogs created from the same IP address.

**Called automatically after login/signup** to associate previously anonymous blogs with the user account.

**Response:**
```json
{
  "claimedCount": 3
}
```

## Database Schema (Firestore)

### `blogs` Collection

Stores all generated blog posts with the following fields:

- `id` - Unique identifier (CUID)
- `userId` - Firebase user ID (null for anonymous blogs)
- `title` - Blog title (extracted from first heading of generated content)
- `content` - Full markdown content of the blog
- `query` - Original user prompt/query
- `imageUrl` - URL to featured image (from Pollinations.ai)
- `ipAddress` - User's IP address (for tracking anonymous users)
- `userAgent` - Browser/device information
- `createdAt` - Timestamp when blog was created
- `updatedAt` - Timestamp of last modification
- `metadata` - JSON object containing:
  - `contentLength` - Length of content in characters
  - `wordCount` - Number of words in the blog
  - `error` - Error message if generation failed

### `custom_prompts` Collection

Stores user-customized AI generation prompts.

- `userId` - Firebase user ID (document ID)
- `prompt` - Custom system prompt for AI
- `updatedAt` - Timestamp of last update

### `rate_limits` Collection

Tracks API usage for rate limiting.

- Document ID format: `ip_{ipAddress}_{date}_{hour}` (for anonymous) or `user_{userId}_{date}` (for authenticated)
- `count` - Number of requests made
- `ipAddress` or `userId` - Identifier
- `firstRequestAt` - Timestamp of first request in period
- `lastRequestAt` - Timestamp of last request
- `resetAt` - When the limit resets

**Rate Limits:**
- Anonymous users: 5 blogs per hour
- Authenticated users: 50 blogs per day

## Customization

### Custom AI Prompts

Users can create custom prompts directly from the UI:

1. Click "Custom Prompt" in the navigation menu
2. Enter your desired system prompt
3. Save to persist it to your profile

The custom prompt is used for all blog generations and can be updated at any time.

### Adjust AI Model

Edit the `model` parameter in `/app/api/generate/route.ts`:

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

### Customize Themes

The application includes 8 built-in themes. To add a new theme:

1. Edit `tailwind.config.ts` to add CSS color variables for your theme
2. Add theme configuration in the components that use theme switching
3. Update `NavMenu.tsx` or `ThemeSelector.tsx` to include the new option

Theme color variables:
- `--bg-1` - Primary background
- `--bg-2` - Secondary background
- `--accent` - Primary accent color
- `--text` - Text color

### Customize Styling

- **Global styles**: Edit `/app/globals.css`
- **Theme colors**: Add CSS variables for new themes in `tailwind.config.ts`
- **Component styles**: Modify individual component files in `/components`
- **Markdown styling**: Adjust styles in `.markdown-content` class in `/app/globals.css`

### Content Safety & Validation

Edit the blocklist patterns in `/app/api/generate/route.ts` under the `contentValidation` function to adjust content filtering rules.

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_GROQ_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PROJECT_ID`
4. Deploy!

### Firebase Production Setup

1. Create a production Firebase project (separate from development if possible)
2. Enable Firestore Database with production rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /blogs/{document=**} {
         allow read: if true;
         allow create: if request.auth != null || request.ip in ['<your_trusted_ips>'];
         allow update, delete: if resource.data.userId == request.auth.uid;
       }
       match /custom_prompts/{document=**} {
         allow read, write: if request.auth.uid == resource.id;
       }
       match /rate_limits/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Set up Firebase Authentication with email/password provider
4. Configure CORS and authorized domains in Firebase Console

## Performance Tips

- Enable Firestore indexes for frequently searched fields (title, query)
- Use Vercel's Edge Functions for optimal performance
- Enable static site generation where possible
- Implement caching headers on static assets
- Monitor Groq API rate limits and optimize request batching
- Consider implementing request deduplication for image generation

## Troubleshooting

### "GROQ_API_KEY is not set" or Firebase errors

Check that all required environment variables are properly set in `.env.local`:
- All `NEXT_PUBLIC_*` variables for client-side Firebase config
- All `FIREBASE_ADMIN_*` variables for server-side authentication

**Note:** Client variables (NEXT_PUBLIC_*) are visible in the browser and safe. Admin variables should only be in `.env.local` and never committed to git.

### Firebase Connection Errors

1. Verify Firebase credentials in `.env.local`
2. Check that Firestore Database is enabled in Firebase Console
3. Ensure Firebase Authentication is set up with email/password provider
4. Check Firestore security rules allow your application
5. Verify your Firebase project ID matches across all config files

### Blog generation fails

Check the blog metadata for error details:
1. Go to the blog's detail page
2. Check the `metadata.error` field in the API response
3. Common issues:
   - Rate limit exceeded (increase limits or wait for reset)
   - Query too short (minimum 3 characters)
   - Content failed validation (adjust prompt or query)
   - Groq API unavailable or rate limited

### Images not generating

Verify:
- Pollinations.ai service is accessible
- Image prompt is valid and descriptive
- No network issues preventing external API calls
- Check browser console for specific errors

### Authentication issues

1. Verify Firebase Authentication is enabled in Console
2. Check that email/password provider is configured
3. Clear browser cookies and localStorage for the site
4. Verify Firebase domain is in authorized domains list
5. Check browser console for specific auth errors

### Markdown not rendering properly

Clear your browser cache and rebuild:
```bash
npm run build
npm run dev
```

Also verify:
- Markdown content is valid
- No script injection attempts (content is sanitized)
- Check browser console for rendering errors

### Rate limiting issues

Check the `rate_limits` collection in Firestore:
1. For anonymous users: limit resets every hour
2. For authenticated users: limit resets every 24 hours
3. IP-based tracking for anonymous users may be affected by VPNs/proxies

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

- For issues, check the GitHub repository
- Report bugs with detailed steps to reproduce
- Suggest features via GitHub discussions

## Changelog

### v1.0.0 (Current)
- Full authentication system with Firebase
- User profiles and blog ownership
- Custom AI prompts per user
- Automatic image generation with Pollinations.ai
- Full CRUD operations on blogs with markdown editor
- Advanced search across all blog fields
- 8 customizable themes with CSS variables
- Content safety and validation
- Smart rate limiting (per-hour for anonymous, per-day for authenticated)
- Automatic blog claiming from same IP
- Blog metadata and statistics (word count, character length)
- Real-time generation status polling
- Responsive mobile design

### v0.1.0
- Initial release
- Basic blog generation with Groq API
- Blog history and pagination
- Simple search functionality
- Responsive design

---

Made with Next.js, Firebase, and Groq AI
