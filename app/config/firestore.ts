/**
 * Firestore Configuration
 * 
 * This file defines the collection names, field names, and indexes used in the app
 * to ensure consistency and avoid typos across the codebase.
 */

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  CUSTOMERS: 'customers',
  PETS: 'pets',
  APPOINTMENTS: 'appointments',
  TODOS: 'todos',
  SERVICES: 'services',
  TRANSACTIONS: 'transactions',
};

// Field names for common queries
export const FIELDS = {
  // Common fields across collections
  USER_ID: 'userId',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  
  // Customer fields
  CUSTOMER_NAME: 'name',
  CUSTOMER_EMAIL: 'email',
  CUSTOMER_PHONE: 'phone',
  CUSTOMER_ADDRESS: 'address',
  CUSTOMER_NOTES: 'notes',
  
  // Pet fields
  PET_NAME: 'name',
  PET_BREED: 'breed',
  PET_SIZE: 'size',
  PET_AGE: 'age',
  PET_CUSTOMER_ID: 'customerId',
  
  // Appointment fields
  APPOINTMENT_DATE: 'dateTime',
  APPOINTMENT_STATUS: 'status',
  APPOINTMENT_CUSTOMER_ID: 'customerId',
  APPOINTMENT_CUSTOMER_NAME: 'customerName',
  APPOINTMENT_PET_IDS: 'petIds',
  APPOINTMENT_SERVICE_IDS: 'serviceIds',
  APPOINTMENT_LOCATION: 'location',
  APPOINTMENT_NOTES: 'notes',
  APPOINTMENT_TOTAL_AMOUNT: 'totalAmount',
  APPOINTMENT_PAYMENT_STATUS: 'paymentStatus',
  
  // Todo fields
  TODO_TITLE: 'title',
  TODO_COMPLETED: 'completed',
  TODO_DESCRIPTION: 'description',
  TODO_DUE_DATE: 'dueDate',
  TODO_PRIORITY: 'priority',
  
  // Service fields
  SERVICE_NAME: 'name',
  SERVICE_DESCRIPTION: 'description',
  SERVICE_PRICE: 'price',
  SERVICE_DURATION: 'duration',
  SERVICE_IS_ACTIVE: 'isActive',
  
  // Transaction fields
  TRANSACTION_AMOUNT: 'amount',
  TRANSACTION_PAYMENT_METHOD: 'paymentMethod',
  TRANSACTION_STATUS: 'status',
  TRANSACTION_APPOINTMENT_ID: 'appointmentId',
  TRANSACTION_CUSTOMER_ID: 'customerId',
  TRANSACTION_STRIPE_PAYMENT_ID: 'stripePaymentId',
};

// Common query patterns that will need indexes
export const INDEXES = [
  // Appointments by userId + dateTime (for calendar view)
  {
    collection: COLLECTIONS.APPOINTMENTS,
    fields: [FIELDS.USER_ID, FIELDS.APPOINTMENT_DATE],
  },
  
  // Customers by userId + name (for searching)
  {
    collection: COLLECTIONS.CUSTOMERS,
    fields: [FIELDS.USER_ID, FIELDS.CUSTOMER_NAME],
  },
  
  // Appointments by customerId + dateTime (for customer history)
  {
    collection: COLLECTIONS.APPOINTMENTS,
    fields: [FIELDS.APPOINTMENT_CUSTOMER_ID, FIELDS.APPOINTMENT_DATE],
  },
  
  // Pets by customerId (for listing pets of a customer)
  {
    collection: COLLECTIONS.PETS,
    fields: [FIELDS.PET_CUSTOMER_ID],
  },
  
  // Todos by userId + completed + dueDate (for task lists)
  {
    collection: COLLECTIONS.TODOS,
    fields: [FIELDS.USER_ID, FIELDS.TODO_COMPLETED, FIELDS.TODO_DUE_DATE],
  },
  
  // Services by userId + isActive (for active services list)
  {
    collection: COLLECTIONS.SERVICES,
    fields: [FIELDS.USER_ID, FIELDS.SERVICE_IS_ACTIVE],
  },
];

// Type definitions for collection data models
export interface FirestoreUser {
  id?: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  businessName?: string;
  subscription?: {
    plan: 'free' | 'pro' | 'business';
    expiresAt: Date;
  };
  settings?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreCustomer {
  id?: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    formatted: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestorePet {
  id?: string;
  customerId: string;
  name: string;
  breed?: string;
  size?: 'small' | 'medium' | 'large';
  age?: number;
  photos?: string[]; // URLs to Firebase Storage
  notes?: string;
  healthConcerns?: string;
  behavioralNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreAppointment {
  id?: string;
  userId: string;
  customerId: string;
  customerName: string;
  petIds: string[];
  serviceIds: string[];
  dateTime: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notes?: string;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreService {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreTransaction {
  id?: string;
  userId: string;
  customerId: string;
  appointmentId?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedOffline: boolean;
  stripePaymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Default values for new documents
export const getDefaultValues = (userId: string) => {
  const now = new Date();
  
  return {
    customer: {
      userId,
      name: '',
      createdAt: now,
      updatedAt: now,
    },
    pet: {
      name: '',
      createdAt: now,
      updatedAt: now,
    },
    appointment: {
      userId,
      status: 'scheduled',
      totalAmount: 0,
      paymentStatus: 'unpaid',
      duration: 60,
      petIds: [],
      serviceIds: [],
      createdAt: now,
      updatedAt: now,
    },
    service: {
      userId,
      name: '',
      price: 0,
      duration: 60,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    transaction: {
      userId,
      amount: 0,
      paymentMethod: 'cash',
      status: 'pending',
      processedOffline: false,
      createdAt: now,
      updatedAt: now,
    },
  };
}; 