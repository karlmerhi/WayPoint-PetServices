import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

/**
 * Storage Service
 * 
 * Manages file uploads and downloads using Firebase Storage
 */
class StorageService {
  /**
   * Upload a file from a URI to Firebase Storage
   * 
   * @param uri Local file URI
   * @param path Storage path (without leading slash)
   * @param fileName Optional filename (defaults to UUID)
   * @param contentType Optional content type
   */
  async uploadFile(
    uri: string,
    path: string,
    fileName?: string,
    contentType?: string
  ): Promise<string> {
    try {
      // Generate a unique filename if not provided
      const name = fileName || `${uuidv4()}.${uri.split('.').pop()}`;
      const storagePath = `${path}/${name}`;
      const storageRef = ref(storage, storagePath);
      
      // Handle file URI format based on platform
      const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      
      // Get file from URI
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Set the content type if provided
      const metadata = contentType ? { contentType } : undefined;
      
      // Upload the file
      await uploadBytes(storageRef, blob, metadata);
      
      // Get and return the download URL
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  
  /**
   * Upload an image with resizing and compression
   * 
   * @param uri Local image URI
   * @param path Storage path (without leading slash)
   * @param options Optional resize and compression options
   */
  async uploadImage(
    uri: string,
    path: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      fileName?: string;
    }
  ): Promise<string> {
    try {
      // Default options
      const width = options?.width || 1200;
      const height = options?.height || 1200;
      const quality = options?.quality || 0.8;
      
      // Resize and compress the image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width, height } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Upload the processed image
      return this.uploadFile(
        manipResult.uri,
        path,
        options?.fileName,
        'image/jpeg'
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
  
  /**
   * Delete a file from Firebase Storage
   * 
   * @param url The download URL or path of the file to delete
   */
  async deleteFile(url: string): Promise<void> {
    try {
      // If the URL is a download URL, extract the path
      const filePath = url.includes('https://') 
        ? url.split('?')[0].split('/o/')[1].replace(/%2F/g, '/')
        : url;
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
  
  /**
   * List all files in a directory
   * 
   * @param path Storage path (without leading slash)
   */
  async listFiles(path: string): Promise<{ name: string; url: string }[]> {
    try {
      const storageRef = ref(storage, path);
      const res = await listAll(storageRef);
      
      const filePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url
        };
      });
      
      return Promise.all(filePromises);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
  
  /**
   * Get a signed URL for a file
   * 
   * @param path Storage path (without leading slash)
   */
  async getFileUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }
  
  /**
   * Generate a unique path for user uploads
   * 
   * @param userId The user ID
   * @param fileType The type of file (e.g., 'pets', 'appointments')
   */
  generateUserFilePath(userId: string, fileType: string): string {
    return `users/${userId}/${fileType}/${uuidv4()}`;
  }
}

export default new StorageService(); 