// Mock Firestore
export const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date) => date),
    now: jest.fn(() => new Date()),
  },
};

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

// Mock Firebase Storage
export const mockStorage = {
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
};

// Mock Firebase Realtime Database
export const mockRTDB = {
  ref: jest.fn(),
  onValue: jest.fn(),
  off: jest.fn(),
  set: jest.fn(),
};

// Mock Firebase Functions
export const mockFunctions = {
  httpsCallable: jest.fn(),
};

// Main mock for Firebase exports
export const mockFirebase = {
  db: mockFirestore,
  auth: mockAuth,
  storage: mockStorage,
  rtdb: mockRTDB,
  functions: mockFunctions,
};

// Helper to reset all mocks
export const resetAllMocks = () => {
  Object.values(mockFirestore).forEach((mockFn) => {
    if (typeof mockFn === 'function' && mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
  
  Object.values(mockAuth).forEach((mockFn) => {
    if (typeof mockFn === 'function' && mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
  
  Object.values(mockStorage).forEach((mockFn) => {
    if (typeof mockFn === 'function' && mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
  
  Object.values(mockRTDB).forEach((mockFn) => {
    if (typeof mockFn === 'function' && mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
  
  Object.values(mockFunctions).forEach((mockFn) => {
    if (typeof mockFn === 'function' && mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
}; 