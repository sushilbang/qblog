"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupEmptyRooms = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Cleanup empty collaboration rooms every hour
exports.cleanupEmptyRooms = functions
    .region('us-central1')
    .pubsub.schedule('every 1 hours')
    .onRun(async (context) => {
    try {
        const roomsRef = db.collection('collaborativeRooms');
        const snapshot = await roomsRef.get();
        const batch = db.batch();
        let deletedCount = 0;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const connectedUsers = data.connectedUsers || [];
            const lastUpdated = data.updatedAt?.toDate?.() || new Date(0);
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            // Delete room if:
            // 1. No connected users AND
            // 2. Not updated in the last hour (to avoid deleting rooms being actively used)
            if (connectedUsers.length === 0 && lastUpdated < hourAgo) {
                batch.delete(doc.ref);
                deletedCount++;
            }
        });
        await batch.commit();
        console.log(`Cleaned up ${deletedCount} empty rooms`);
        return null;
    }
    catch (error) {
        console.error('Error cleaning up empty rooms:', error);
        throw error;
    }
});
//# sourceMappingURL=cleanupEmptyRooms.js.map