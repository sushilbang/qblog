import { adminDb } from './firebase-admin'
import * as admin from 'firebase-admin'

export interface Blog {
  id: string
  userId: string | null
  title: string
  content: string
  query: string
  imageUrl?: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

/**
 * Create a new blog in Firestore
 */
export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  try {
    const blogRef = adminDb.collection('blogs').doc()
    const now = admin.firestore.Timestamp.now()

    const blogData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    await blogRef.set(blogData)

    return {
      id: blogRef.id,
      ...data,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    }
  } catch (error) {
    console.error('Error creating blog:', error)
    throw error
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlog(blogId: string): Promise<Blog | null> {
  try {
    const doc = await adminDb.collection('blogs').doc(blogId).get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data()
    if (!data) {
      return null
    }
    return {
      id: doc.id,
      userId: data.userId || null,
      title: data.title,
      content: data.content,
      query: data.query,
      imageUrl: data.imageUrl || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      metadata: data.metadata,
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    throw error
  }
}

/**
 * Get all blogs by a specific user
 */
export async function getBlogsByUserId(userId: string, limit: number = 50): Promise<Blog[]> {
  try {
    const snapshot = await adminDb
      .collection('blogs')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId || null,
        title: data.title,
        content: data.content,
        query: data.query,
        imageUrl: data.imageUrl || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        metadata: data.metadata,
      }
    })
  } catch (error) {
    console.error('Error fetching user blogs:', error)
    throw error
  }
}

/**
 * Get all blogs (paginated) - for blog library
 */
export async function getAllBlogs(
  limit: number = 12,
  offset: number = 0,
  searchQuery?: string
): Promise<{ blogs: Blog[]; total: number }> {
  try {
    let query: FirebaseFirestore.Query = adminDb.collection('blogs')

    // Search by title, query, or content
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      const snapshot = await query.get()

      const filtered = snapshot.docs
        .map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: data.userId || null,
            title: data.title,
            content: data.content,
            query: data.query,
            imageUrl: data.imageUrl || null,
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            metadata: data.metadata,
          }
        })
        .filter(
          (blog) =>
            blog.title.toLowerCase().includes(lowerSearch) ||
            blog.query.toLowerCase().includes(lowerSearch) ||
            blog.content.toLowerCase().includes(lowerSearch)
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const paginated = filtered.slice(offset, offset + limit)

      return {
        blogs: paginated,
        total: filtered.length,
      }
    }

    // No search - just paginate
    const snapshot = await query.orderBy('createdAt', 'desc').get()

    const allBlogs = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId || null,
        title: data.title,
        content: data.content,
        query: data.query,
        imageUrl: data.imageUrl || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        metadata: data.metadata,
      }
    })

    const paginated = allBlogs.slice(offset, offset + limit)

    return {
      blogs: paginated,
      total: allBlogs.length,
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

/**
 * Get recent blogs (for homepage)
 */
export async function getRecentBlogs(limit: number = 3): Promise<Blog[]> {
  try {
    const snapshot = await adminDb
      .collection('blogs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId || null,
        title: data.title,
        content: data.content,
        query: data.query,
        imageUrl: data.imageUrl || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        metadata: data.metadata,
      }
    })
  } catch (error) {
    console.error('Error fetching recent blogs:', error)
    throw error
  }
}

/**
 * Update a blog
 */
export async function updateBlog(
  blogId: string,
  data: Partial<Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Blog> {
  try {
    const now = admin.firestore.Timestamp.now()

    await adminDb.collection('blogs').doc(blogId).update({
      ...data,
      updatedAt: now,
    })

    // Fetch updated blog
    const updated = await getBlog(blogId)
    if (!updated) throw new Error('Blog not found after update')

    return updated
  } catch (error) {
    console.error('Error updating blog:', error)
    throw error
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(blogId: string): Promise<void> {
  try {
    await adminDb.collection('blogs').doc(blogId).delete()
  } catch (error) {
    console.error('Error deleting blog:', error)
    throw error
  }
}

/**
 * Check if user owns the blog (for authorization)
 */
export async function userOwnsBlog(blogId: string, userId: string): Promise<boolean> {
  try {
    const blog = await getBlog(blogId)
    return blog?.userId === userId
  } catch {
    return false
  }
}

/**
 * Claim unsigned blogs by IP address when user signs up
 * Assigns userId to all blogs created from the same IP with userId: null
 */
export async function claimUnsignedBlogs(userId: string, ipAddress: string | null): Promise<number> {
  try {
    if (!ipAddress) {
      console.warn('No IP address provided, cannot claim unsigned blogs')
      return 0
    }

    // Query all blogs with userId: null
    const snapshot = await adminDb
      .collection('blogs')
      .where('userId', '==', null)
      .where('ipAddress', '==', ipAddress)
      .get()

    const batch = adminDb.batch()
    let claimedCount = 0

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        userId,
        updatedAt: admin.firestore.Timestamp.now(),
      })
      claimedCount++
    })

    if (claimedCount > 0) {
      await batch.commit()
      console.log(`Successfully claimed ${claimedCount} blogs for user ${userId}`)
    }

    return claimedCount
  } catch (error) {
    console.error('Error claiming unsigned blogs:', error)
    throw error
  }
}
