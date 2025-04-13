import {
  uploadFirestoreRules,
  uploadDatabaseRules,
  addFirestoreDocument,
  updateDatabaseEntry,
} from "@/app/firebase";
import * as FileSystem from "expo-file-system";

/**
 * Utility functions for Firebase administration tasks
 */

/**
 * Upload Firestore rules from a file
 * @param filePath Path to the rules file
 */
export const uploadFirestoreRulesFromFile = async (
  filePath: string,
): Promise<any> => {
  try {
    // Read the rules file
    const rulesContent = await FileSystem.readAsStringAsync(filePath);

    // Upload the rules
    return await uploadFirestoreRules(rulesContent);
  } catch (error) {
    console.error("Error uploading Firestore rules from file:", error);
    throw error;
  }
};

/**
 * Upload Realtime Database rules from a file
 * @param filePath Path to the rules file
 */
export const uploadDatabaseRulesFromFile = async (
  filePath: string,
): Promise<any> => {
  try {
    // Read the rules file
    const rulesContent = await FileSystem.readAsStringAsync(filePath);

    // Upload the rules
    return await uploadDatabaseRules(rulesContent);
  } catch (error) {
    console.error("Error uploading Database rules from file:", error);
    throw error;
  }
};

/**
 * Bulk import data to Firestore from a JSON file
 * @param collectionName Collection to import to
 * @param filePath Path to the JSON file containing data
 */
export const importFirestoreData = async (
  collectionName: string,
  filePath: string,
): Promise<any[]> => {
  try {
    // Read and parse the JSON file
    const jsonContent = await FileSystem.readAsStringAsync(filePath);
    const data = JSON.parse(jsonContent);

    if (!Array.isArray(data)) {
      throw new Error("Data must be an array of objects");
    }

    // Add each document to Firestore
    const results = [];
    for (const item of data) {
      const result = await addFirestoreDocument(collectionName, item);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error(
      `Error importing data to Firestore collection ${collectionName}:`,
      error,
    );
    throw error;
  }
};

/**
 * Bulk import data to Realtime Database from a JSON file
 * @param basePath Base path in the database
 * @param filePath Path to the JSON file containing data
 */
export const importDatabaseData = async (
  basePath: string,
  filePath: string,
): Promise<any> => {
  try {
    // Read and parse the JSON file
    const jsonContent = await FileSystem.readAsStringAsync(filePath);
    const data = JSON.parse(jsonContent);

    // Update the database
    return await updateDatabaseEntry(basePath, data);
  } catch (error) {
    console.error(`Error importing data to database path ${basePath}:`, error);
    throw error;
  }
};

/**
 * Create a backup of Firestore data to a local file
 * @param collectionName Collection to backup
 * @param filePath Path to save the backup file
 */
export const backupFirestoreCollection = async (
  collectionName: string,
  filePath: string,
): Promise<void> => {
  try {
    // Get all documents from the collection
    const documents = await fetch(
      `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com/${collectionName}.json`,
    ).then((res) => res.json());

    // Save to file
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(documents, null, 2),
    );
  } catch (error) {
    console.error(
      `Error backing up Firestore collection ${collectionName}:`,
      error,
    );
    throw error;
  }
};

/**
 * Create a backup of a Realtime Database path to a local file
 * @param dbPath Path in the database to backup
 * @param filePath Path to save the backup file
 */
export const backupDatabasePath = async (
  dbPath: string,
  filePath: string,
): Promise<void> => {
  try {
    // Get data from the database path
    const data = await fetch(
      `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com/${dbPath}.json`,
    ).then((res) => res.json());

    // Save to file
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(data, null, 2),
    );
  } catch (error) {
    console.error(`Error backing up database path ${dbPath}:`, error);
    throw error;
  }
};
