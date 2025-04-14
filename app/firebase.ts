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
import { 
  getAuth, 
  connectAuthEmulator, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Firebase services with AsyncStorage persistence for Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development environment - DISABLED FOR NOW
// Uncomment this block when you have Firebase emulators properly set up
/*
if (process.env.EXPO_PUBLIC_APP_ENV === "development") {
  console.log("Using Firebase Emulators in development mode");
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(rtdb, "localhost", 9000);
  connectStorageEmulator(storage, "localhost", 9199);
  connectFunctionsEmulator(functions, "localhost", 5001);
}
*/

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

// Default export to prevent Expo Router warnings
const firebaseServices = {
  app,
  auth,
  db,
  rtdb,
  storage,
  functions,
  uploadFirestoreRules,
  uploadDatabaseRules,
  updateDatabaseEntry,
  addFirestoreDocument
};

export default firebaseServices;
