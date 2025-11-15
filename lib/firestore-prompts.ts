import { adminDb } from './firebase-admin'
import * as admin from 'firebase-admin'

export interface CustomPrompt {
  userId: string
  prompt: string
  updatedAt: Date
}

/**
 * Save or update user's custom prompt
 */
export async function saveCustomPrompt(userId: string, prompt: string): Promise<void> {
  try {
    await adminDb
      .collection('custom_prompts')
      .doc(userId)
      .set(
        {
          userId,
          prompt,
          updatedAt: admin.firestore.Timestamp.now(),
        },
        { merge: true }
      )
  } catch (error) {
    console.error('Error saving custom prompt:', error)
    throw error
  }
}

/**
 * Get user's custom prompt
 */
export async function getCustomPrompt(userId: string): Promise<string | null> {
  try {
    const doc = await adminDb.collection('custom_prompts').doc(userId).get()

    if (!doc.exists) {
      return null
    }

    return doc.data()?.prompt || null
  } catch (error) {
    console.error('Error fetching custom prompt:', error)
    throw error
  }
}

/**
 * Delete user's custom prompt (reset to default)
 */
export async function deleteCustomPrompt(userId: string): Promise<void> {
  try {
    await adminDb.collection('custom_prompts').doc(userId).delete()
  } catch (error) {
    console.error('Error deleting custom prompt:', error)
    throw error
  }
}
