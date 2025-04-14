import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { COLLECTIONS, FIELDS, INDEXES } from '../config/firestore';

/**
 * Firestore Service
 * 
 * Provides utilities for managing Firestore collections, documents and indexes
 */
class FirestoreService {
  /**
   * Create a new document with a specific ID
   * 
   * @param collectionName The collection to add the document to
   * @param docId The ID to use for the document (will overwrite if exists)
   * @param data The document data
   */
  async createDocumentWithId(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      id: docId,
    });
    return { id: docId, ...data };
  }

  /**
   * Get all documents from a collection that belong to a user
   * 
   * @param collectionName The collection to query
   * @param userId The user ID to filter by
   */
  async getDocumentsByUserId(collectionName: string, userId: string) {
    const q = query(
      collection(db, collectionName),
      where(FIELDS.USER_ID, '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Perform a batch operation on multiple documents
   * 
   * @param operations Array of operations to perform
   */
  async batchOperation(operations: Array<{
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: any;
  }>) {
    const batch = writeBatch(db);

    operations.forEach(operation => {
      const docRef = doc(db, operation.collection, operation.docId);

      switch (operation.type) {
        case 'set':
          batch.set(docRef, { 
            ...operation.data,
            id: operation.docId
          });
          break;
        case 'update':
          batch.update(docRef, operation.data);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  }

  /**
   * Check if a document exists
   * 
   * @param collectionName The collection to check
   * @param docId The document ID to check
   */
  async documentExists(collectionName: string, docId: string): Promise<boolean> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  /**
   * Helper to log the required indexes for the application
   * Used for setting up Firestore indexes
   */
  logRequiredIndexes() {
    console.log('Required Firestore Indexes:');
    console.log(JSON.stringify(INDEXES, null, 2));
    
    // Log in a format suitable for Firebase CLI
    console.log('\nFirebase CLI format:');
    let indexesString = INDEXES.map(idx => {
      return `firebase firestore:indexes --collection-group="${idx.collection}" --fields="${idx.fields.join(',')}" --query-scope="COLLECTION"`;
    }).join('\n');
    
    console.log(indexesString);
  }

  /**
   * Create a backup of user data
   * 
   * @param userId The user ID to backup data for
   */
  async backupUserData(userId: string) {
    const backup: Record<string, any[]> = {};
    
    // Backup each collection
    for (const collection of Object.values(COLLECTIONS)) {
      const data = await this.getDocumentsByUserId(collection, userId);
      if (data.length > 0) {
        backup[collection] = data;
      }
    }
    
    // Create a backup document in a backups collection
    const timestamp = new Date().toISOString();
    const backupId = `${userId}_${timestamp}`;
    
    await this.createDocumentWithId('backups', backupId, {
      userId,
      timestamp,
      data: backup
    });
    
    return backupId;
  }
}

export default new FirestoreService(); 