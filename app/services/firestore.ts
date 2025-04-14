import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentReference,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";

// Type definitions for our collections
export interface Customer {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    formatted: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notes?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Pet {
  id?: string;
  customerId: string;
  name: string;
  breed?: string;
  size: 'small' | 'medium' | 'large';
  age?: number;
  photos?: string[];
  notes?: string;
  healthConcerns?: string;
  behavioralNotes?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Appointment {
  id?: string;
  userId: string;
  customerId: string;
  petIds: string[];
  serviceIds: string[];
  dateTime: Timestamp | Date;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
  location?: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notes?: string;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Service {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Collection names
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  PETS: 'pets',
  APPOINTMENTS: 'appointments',
  SERVICES: 'services',
};

// Generic function to convert Firestore data with ID
const convertWithId = <T extends DocumentData>(doc: DocumentData): T => {
  return { id: doc.id, ...doc.data() } as T;
};

// Base CRUD operations for any collection
class FirestoreService<T extends DocumentData> {
  collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create an item with a generated ID
  async create(data: T): Promise<string> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Create an item with a specific ID
  async createWithId(id: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error creating document with ID in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get an item by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return convertWithId<T>(docSnap);
      }
      return null;
    } catch (error) {
      console.error(`Error getting document by ID from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get all items in a collection with optional query constraints
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => convertWithId<T>(doc));
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update an item
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete an item
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query items with various constraints
  async query(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => convertWithId<T>(doc));
    } catch (error) {
      console.error(`Error querying documents from ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Specific services for each collection
export const customersService = new FirestoreService<Customer>(COLLECTIONS.CUSTOMERS);
export const petsService = new FirestoreService<Pet>(COLLECTIONS.PETS);
export const appointmentsService = new FirestoreService<Appointment>(COLLECTIONS.APPOINTMENTS);
export const servicesService = new FirestoreService<Service>(COLLECTIONS.SERVICES);

// Specific helper functions for common operations
export const getCustomersByUserId = async (userId: string): Promise<Customer[]> => {
  return customersService.query([
    where('userId', '==', userId),
    orderBy('name', 'asc')
  ]);
};

export const getPetsByCustomerId = async (customerId: string): Promise<Pet[]> => {
  return petsService.query([
    where('customerId', '==', customerId),
    orderBy('name', 'asc')
  ]);
};

export const getUpcomingAppointments = async (userId: string, count = 5): Promise<Appointment[]> => {
  return appointmentsService.query([
    where('userId', '==', userId),
    where('dateTime', '>=', new Date()),
    where('status', 'in', ['scheduled', 'confirmed']),
    orderBy('dateTime', 'asc'),
    limit(count)
  ]);
};

export const getActiveServices = async (userId: string): Promise<Service[]> => {
  return servicesService.query([
    where('userId', '==', userId),
    where('isActive', '==', true),
    orderBy('name', 'asc')
  ]);
}; 