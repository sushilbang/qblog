import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const db = admin.firestore()

// Cleanup empty collaboration rooms every hour
export const cleanupEmptyRooms = functions
  .region('us-central1')
  .pubsub.schedule('every 1 hours')
  .onRun(async (context) => {
    try {
      const roomsRef = db.collection('collaborativeRooms')
      const snapshot = await roomsRef.get()

      const batch = db.batch()
      let deletedCount = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        const connectedUsers = data.connectedUsers || []
        const lastUpdated = data.updatedAt?.toDate?.() || new Date(0)
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000)

        // Delete room if:
        // 1. No connected users AND
        // 2. Not updated in the last hour (to avoid deleting rooms being actively used)
        if (connectedUsers.length === 0 && lastUpdated < hourAgo) {
          batch.delete(doc.ref)
          deletedCount++
        }
      })

      await batch.commit()
      console.log(`Cleaned up ${deletedCount} empty rooms`)
      return null
    } catch (error) {
      console.error('Error cleaning up empty rooms:', error)
      throw error
    }
  })
