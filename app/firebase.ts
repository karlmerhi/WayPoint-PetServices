import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  update,
  connectDatabaseEmulator,
} from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development environment
if (process.env.EXPO_PUBLIC_APP_ENV === "development") {
  console.log("Using Firebase Emulators in development mode");
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(rtdb, "localhost", 9000);
  connectStorageEmulator(storage, "localhost", 9199);
  connectFunctionsEmulator(functions, "localhost", 5001);
  // Note: There's no direct connector for Pub/Sub emulator in client SDKs
}

// Upload Firestore rules
export const uploadFirestoreRules = async (rulesContent: string) => {
  try {
    // This would typically be done through a Cloud Function
    // For demonstration, we'll use a custom function
    const uploadRules = httpsCallable(functions, "uploadFirestoreRules");
    return await uploadRules({ rules: rulesContent });
  } catch (error) {
    console.error("Error uploading Firestore rules:", error);
    throw error;
  }
};

// Upload Realtime Database rules
export const uploadDatabaseRules = async (rulesContent: string) => {
  try {
    const uploadRules = httpsCallable(functions, "uploadDatabaseRules");
    return await uploadRules({ rules: rulesContent });
  } catch (error) {
    console.error("Error uploading Database rules:", error);
    throw error;
  }
};

// Create or update database entries
export const updateDatabaseEntry = async (path: string, data: any) => {
  try {
    const dbRef = ref(rtdb, path);
    await update(dbRef, data);
    return { success: true };
  } catch (error) {
    console.error(`Error updating database at ${path}:`, error);
    throw error;
  }
};

// Add a document to a Firestore collection
export const addFirestoreDocument = async (
  collectionName: string,
  data: any,
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export { app };
