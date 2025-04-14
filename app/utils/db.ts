import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query as firebaseQuery,
  where, 
  onSnapshot, 
  writeBatch,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
  Query,
  Unsubscribe,
  FirestoreError 
} from 'firebase/firestore';
import { db } from '../firebase';
import { StorageError } from './storage';

export class DbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DbError';
  }
}

// Define base model interface with common fields
export interface BaseModel {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Generic CRUD operations for Firestore collections
export class FirestoreCollection<T extends BaseModel> {
  private collectionRef: CollectionReference;
  
  constructor(collectionPath: string) {
    this.collectionRef = collection(db, collectionPath);
  }
  
  // Create a new document
  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(this.collectionRef, docData);
      const docSnap = await getDoc(docRef);
      
      return {
        id: docRef.id,
        ...docSnap.data(),
      } as T;
    } catch (error) {
      console.error('Error creating document:', error);
      throw new DbError(`Failed to create document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    } catch (error) {
      console.error('Error getting document:', error);
      throw new DbError(`Failed to get document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T> {
    try {
      const docRef = doc(this.collectionRef, id);
      const now = Timestamp.now();
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: now,
      });
      
      const updatedDoc = await getDoc(docRef);
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as T;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new DbError(`Failed to update document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new DbError(`Failed to delete document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Query documents
  async query(queryBuilder: (ref: CollectionReference) => Query): Promise<T[]> {
    try {
      const queryRef = queryBuilder(this.collectionRef);
      const querySnapshot = await getDocs(queryRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw new DbError(`Failed to query documents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Get all documents in a collection
  async getAll(): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error('Error getting all documents:', error);
      throw new DbError(`Failed to get all documents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Listen to collection changes
  subscribe(
    onNext: (data: T[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const unsubscribe = onSnapshot(
      this.collectionRef,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        onNext(data);
      },
      (error) => {
        console.error('Subscription error:', error);
        if (onError) {
          onError(new DbError(`Subscription error: ${error.message}`));
        }
      }
    );
    
    return unsubscribe;
  }
  
  // Listen to a single document changes
  subscribeToDocument(
    id: string,
    onNext: (data: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const docRef = doc(this.collectionRef, id);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          onNext(null);
          return;
        }
        
        const data = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as T;
        
        onNext(data);
      },
      (error) => {
        console.error('Document subscription error:', error);
        if (onError) {
          onError(new DbError(`Document subscription error: ${error.message}`));
        }
      }
    );
    
    return unsubscribe;
  }
  
  // Batch operations with multiple documents
  async batchOperation(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      id?: string;
      data?: any;
    }>
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();
      
      operations.forEach(operation => {
        const { type, id, data } = operation;
        
        switch (type) {
          case 'create':
            let docRef;
            if (id) {
              docRef = doc(this.collectionRef, id);
              batch.set(docRef, {
                ...data,
                createdAt: now,
                updatedAt: now,
              });
            } else {
              docRef = doc(this.collectionRef);
              batch.set(docRef, {
                ...data,
                createdAt: now,
                updatedAt: now,
              });
            }
            break;
            
          case 'update':
            if (!id) throw new Error('ID is required for update operation');
            const updateDocRef = doc(this.collectionRef, id);
            batch.update(updateDocRef, {
              ...data,
              updatedAt: now,
            });
            break;
            
          case 'delete':
            if (!id) throw new Error('ID is required for delete operation');
            const deleteDocRef = doc(this.collectionRef, id);
            batch.delete(deleteDocRef);
            break;
            
          default:
            throw new Error(`Unsupported batch operation type: ${type}`);
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw new DbError(`Failed to execute batch operation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 