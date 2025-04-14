import { 
  customersService, 
  petsService, 
  getCustomersByUserId,
  Customer,
  Pet
} from '../../app/services/firestore';
import * as firebase from '../../app/firebase';
import { mockFirestore, resetAllMocks } from '../mocks/firebase';

// Mock the firebase module
jest.mock('../../app/firebase', () => ({
  db: {},
}));

// Mock firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'collection-mock'),
  doc: jest.fn(() => 'doc-mock'),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn((collection, ...constraints) => ({
    collection,
    constraints,
  })),
  where: jest.fn((field, op, value) => ({ type: 'where', field, op, value })),
  orderBy: jest.fn((field, direction) => ({ type: 'orderBy', field, direction })),
  limit: jest.fn((value) => ({ type: 'limit', value })),
  Timestamp: {
    fromDate: jest.fn((date) => date),
    now: jest.fn(() => new Date()),
  },
}));

// Sample data for tests
const mockCustomer: Customer = {
  userId: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPet: Pet = {
  customerId: 'customer123',
  name: 'Fluffy',
  size: 'medium',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Firestore Service', () => {
  beforeEach(() => {
    resetAllMocks();
    // Assign the mock to the firebase.db variable used by the services
    Object.defineProperty(firebase, 'db', {
      value: mockFirestore,
      writable: true,
    });
  });

  describe('customersService', () => {
    test('create() should add a new customer', async () => {
      // Mock implementation for addDoc
      const mockAddDocRef = { id: 'customer123' };
      const addDocMock = require('firebase/firestore').addDoc;
      addDocMock.mockResolvedValueOnce(mockAddDocRef);

      // Call the service
      const id = await customersService.create(mockCustomer);

      // Assertions
      expect(id).toBe('customer123');
      expect(addDocMock).toHaveBeenCalledTimes(1);
      // Check if it includes createdAt and updatedAt fields
      const addedData = addDocMock.mock.calls[0][1];
      expect(addedData).toHaveProperty('createdAt');
      expect(addedData).toHaveProperty('updatedAt');
      expect(addedData).toHaveProperty('name', 'John Doe');
    });

    test('getById() should return a customer if it exists', async () => {
      // Mock implementation for getDoc
      const getDocMock = require('firebase/firestore').getDoc;
      getDocMock.mockResolvedValueOnce({
        exists: () => true,
        id: 'customer123',
        data: () => ({ ...mockCustomer }),
      });

      // Call the service
      const customer = await customersService.getById('customer123');

      // Assertions
      expect(customer).toHaveProperty('id', 'customer123');
      expect(customer).toHaveProperty('name', 'John Doe');
      expect(getDocMock).toHaveBeenCalledTimes(1);
    });

    test('getById() should return null if customer does not exist', async () => {
      // Mock implementation for getDoc
      const getDocMock = require('firebase/firestore').getDoc;
      getDocMock.mockResolvedValueOnce({
        exists: () => false,
      });

      // Call the service
      const customer = await customersService.getById('nonexistent');

      // Assertions
      expect(customer).toBeNull();
      expect(getDocMock).toHaveBeenCalledTimes(1);
    });

    test('update() should update a customer', async () => {
      // Mock implementation for updateDoc
      const updateDocMock = require('firebase/firestore').updateDoc;
      updateDocMock.mockResolvedValueOnce(undefined);

      // Call the service
      await customersService.update('customer123', { name: 'Jane Doe' });

      // Assertions
      expect(updateDocMock).toHaveBeenCalledTimes(1);
      // Check if it includes updatedAt field
      const updatedData = updateDocMock.mock.calls[0][1];
      expect(updatedData).toHaveProperty('updatedAt');
      expect(updatedData).toHaveProperty('name', 'Jane Doe');
    });

    test('delete() should delete a customer', async () => {
      // Mock implementation for deleteDoc
      const deleteDocMock = require('firebase/firestore').deleteDoc;
      deleteDocMock.mockResolvedValueOnce(undefined);

      // Call the service
      await customersService.delete('customer123');

      // Assertions
      expect(deleteDocMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Helper functions', () => {
    test('getCustomersByUserId() should query customers by userId', async () => {
      // Mock implementation for query and getDocs
      const queryMock = require('firebase/firestore').query;
      const getDocsMock = require('firebase/firestore').getDocs;
      getDocsMock.mockResolvedValueOnce({
        docs: [
          {
            id: 'customer123',
            data: () => ({ ...mockCustomer }),
          },
          {
            id: 'customer456',
            data: () => ({ ...mockCustomer, name: 'Jane Doe' }),
          },
        ],
      });

      // Call the helper function
      const customers = await getCustomersByUserId('user123');

      // Assertions
      expect(customers).toHaveLength(2);
      expect(customers[0]).toHaveProperty('id', 'customer123');
      expect(customers[1]).toHaveProperty('id', 'customer456');
      expect(customers[1]).toHaveProperty('name', 'Jane Doe');
      
      // Check if the where clause was called correctly
      const whereMock = require('firebase/firestore').where;
      expect(whereMock).toHaveBeenCalledWith('userId', '==', 'user123');
      
      // Check if orderBy was called correctly
      const orderByMock = require('firebase/firestore').orderBy;
      expect(orderByMock).toHaveBeenCalledWith('name', 'asc');
    });
  });
}); 