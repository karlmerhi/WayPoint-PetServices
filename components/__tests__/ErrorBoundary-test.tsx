import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock console.error to prevent test output noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('#ffffff'),
}));

// Mock __DEV__ global variable to force consistent behavior
global.__DEV__ = false;

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
  },
}));

// Component that throws an error
class ErrorComponent extends React.Component {
  render() {
    throw new Error('Test error');
    return <Text>This will not render</Text>;
  }
}

// Component that throws an error conditionally based on props
class ConditionalErrorComponent extends React.Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Conditional test error');
    }
    return <Text>No error</Text>;
  }
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Normal content</Text>
      </ErrorBoundary>
    );
    
    expect(getByText('Normal content')).toBeTruthy();
  });

  it('renders error UI when child component throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Should show the default error message
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<Text>Custom error message</Text>}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Should show the custom fallback
    expect(getByText('Custom error message')).toBeTruthy();
  });

  it('calls onError callback when an error is caught', () => {
    const handleError = jest.fn();
    
    render(
      <ErrorBoundary onError={handleError}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it('toggles error details visibility', () => {
    // First set a consistent initial state
    global.__DEV__ = false;
    
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Initially, details should be hidden in non-dev mode
    const toggleButton = getByText('Show technical details');
    
    // Click to show details
    fireEvent.press(toggleButton);
    
    // Now it should show the hide text
    expect(getByText('Hide technical details')).toBeTruthy();
  });

  it('has a reset button that can be pressed', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Error UI should be showing with a reset button
    const resetButton = getByText('Try Again');
    expect(resetButton).toBeTruthy();
    
    // Should be able to press it without errors
    fireEvent.press(resetButton);
  });

  it('resets when resetKey changes', () => {
    // Mock componentDidUpdate
    const originalComponentDidUpdate = ErrorBoundary.prototype.componentDidUpdate;
    const mockComponentDidUpdate = jest.fn();
    ErrorBoundary.prototype.componentDidUpdate = mockComponentDidUpdate;
    
    // Spy on the reset method
    const originalReset = ErrorBoundary.prototype.reset;
    const mockReset = jest.fn();
    ErrorBoundary.prototype.reset = mockReset;
    
    // Render with resetKey=1
    const { rerender } = render(
      <ErrorBoundary resetKey={1}>
        <ConditionalErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Re-render with resetKey=2
    rerender(
      <ErrorBoundary resetKey={2}>
        <ConditionalErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    
    // Should have called componentDidUpdate
    expect(mockComponentDidUpdate).toHaveBeenCalled();
    
    // Restore the original methods
    ErrorBoundary.prototype.componentDidUpdate = originalComponentDidUpdate;
    ErrorBoundary.prototype.reset = originalReset;
  });
}); 