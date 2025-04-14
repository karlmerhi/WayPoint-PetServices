import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { OfflineIndicator } from '../OfflineIndicator';

// Mock NetInfo module
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()), // Return unsubscribe function
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

// Mock MaterialIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock useThemeColor for ThemedText
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('#000'),
}));

// Mock Animated.View to be a regular View for testing
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Animated.View = rn.View;
  rn.Animated.timing = jest.fn(() => ({ start: jest.fn() }));
  rn.Animated.Value = jest.fn(() => ({ setValue: jest.fn() }));
  return rn;
});

describe('OfflineIndicator', () => {
  // Mock implementation of NetInfo for each test
  beforeEach(() => {
    const NetInfo = require('@react-native-community/netinfo');
    NetInfo.fetch.mockClear();
    NetInfo.addEventListener.mockClear();
  });

  it('subscribes to NetInfo changes on mount', () => {
    const NetInfo = require('@react-native-community/netinfo');
    render(<OfflineIndicator />);
    
    // Should subscribe to network changes
    expect(NetInfo.addEventListener).toHaveBeenCalled();
  });

  it('unsubscribes from NetInfo changes on unmount', () => {
    const NetInfo = require('@react-native-community/netinfo');
    const unsubscribeMock = jest.fn();
    NetInfo.addEventListener.mockReturnValueOnce(unsubscribeMock);
    
    const { unmount } = render(<OfflineIndicator />);
    unmount();
    
    // Should unsubscribe when component unmounts
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('accepts customization props', () => {
    // Just check that it renders without errors
    const { unmount } = render(
      <OfflineIndicator 
        message="Custom offline message" 
        position="bottom" 
      />
    );
    
    unmount();
  });
}); 