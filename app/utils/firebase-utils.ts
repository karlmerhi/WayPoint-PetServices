import { db, rtdb, storage, functions } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  WhereFilterOp,
} from "firebase/firestore";
import { ref, onValue, off, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";

/**
 * Helper functions for working with Firebase services
 */

// Firestore Operations

/**
 * Fetch a document from Firestore by its ID
 */
export const getDocument = async <T>(
  collectionName: string,
  docId: string,
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() } as unknown as T;
    }
    return null;
  } catch (error) {
    console.error(
      `Error fetching document ${docId} from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

/**
 * Query documents from a collection with optional filtering
 */
export const queryDocuments = async <T>(
  collectionName: string,
  field?: string,
  operator?: WhereFilterOp,
  value?: any,
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef);

    if (field && operator && value !== undefined) {
      q = query(collectionRef, where(field, operator, value));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[];
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// Realtime Database Operations

/**
 * Listen to a path in the Realtime Database
 */
export const listenToPath = <T>(
  path: string,
  callback: (data: T | null) => void,
): (() => void) => {
  const dbRef = ref(rtdb, path);

  onValue(
    dbRef,
    (snapshot) => {
      callback(snapshot.val());
    },
    (error) => {
      console.error(`Error listening to ${path}:`, error);
      callback(null);
    },
  );

  // Return unsubscribe function
  return () => off(dbRef);
};

/**
 * Set data at a specific path in the Realtime Database
 */
export const setData = async (path: string, data: any): Promise<void> => {
  try {
    const dbRef = ref(rtdb, path);
    await set(dbRef, data);
  } catch (error) {
    console.error(`Error setting data at ${path}:`, error);
    throw error;
  }
};

// Storage Operations

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  path: string,
  uri: string,
  metadata?: any,
): Promise<string> => {
  try {
    const reference = storageRef(storage, path);

    // Fetch the file and convert to blob
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    // Upload the file
    await uploadBytes(reference, blob, metadata);

    // Get download URL
    return await getDownloadURL(reference);
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const reference = storageRef(storage, path);
    await deleteObject(reference);
  } catch (error) {
    console.error(`Error deleting file at ${path}:`, error);
    throw error;
  }
};

// Functions Operations

/**
 * Call a Firebase Cloud Function
 */
export const callFunction = async <T, R>(
  name: string,
  data?: T,
): Promise<R> => {
  try {
    const callable = httpsCallable(functions, name);
    const result = await callable(data);
    return result.data as R;
  } catch (error) {
    console.error(`Error calling function ${name}:`, error);
    throw error;
  }
};
