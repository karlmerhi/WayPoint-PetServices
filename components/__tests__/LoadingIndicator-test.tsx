import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { LoadingIndicator } from '../LoadingIndicator';

// Mock useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('#0a7ea4'),
}));

describe('LoadingIndicator', () => {
  it('renders with default props', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator />);
    
    // Should contain an ActivityIndicator
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
    expect(indicator.props.size).toBe('large');
  });

  it('renders with custom size', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator size="small" />);
    
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.size).toBe('small');
  });

  it('renders with a message', () => {
    const message = 'Loading data...';
    const { getByText } = render(<LoadingIndicator message={message} />);
    
    expect(getByText(message)).toBeTruthy();
  });

  it('renders with custom color', () => {
    const customColor = '#ff0000';
    const { UNSAFE_getByType } = render(<LoadingIndicator color={customColor} />);
    
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.color).toBe(customColor);
  });

  it('handles fullScreen prop', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator fullScreen />);
    
    // Get the root View component
    const container = UNSAFE_getByType('View');
    
    // Check if the container styles include fullScreen styles
    const hasFullScreenStyle = container.props.style.some(
      style => style && 
      style.position === 'absolute' && 
      style.top === 0 && 
      style.left === 0 && 
      style.right === 0 && 
      style.bottom === 0
    );
    
    expect(hasFullScreenStyle).toBeTruthy();
  });

  it('handles overlay prop', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator overlay />);
    
    // Get the root View component
    const container = UNSAFE_getByType('View');
    
    // Check if the container styles include overlay styles
    const hasOverlayStyle = container.props.style.some(
      style => style && 
      style.backgroundColor === 'rgba(0, 0, 0, 0.3)' && 
      style.zIndex === 999
    );
    
    expect(hasOverlayStyle).toBeTruthy();
  });

  it('renders Inline preset correctly', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator.Inline />);
    
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.size).toBe('small');
    
    // Check if the container includes the inline style (flexDirection: row)
    const container = UNSAFE_getByType('View');
    
    // The inline style is nested inside an array
    const hasInlineStyle = container.props.style.some(style => {
      if (Array.isArray(style)) {
        return style.some(s => s && s.flexDirection === 'row');
      }
      return style && style.flexDirection === 'row';
    });
    
    expect(hasInlineStyle).toBeTruthy();
  });

  it('renders FullScreen preset correctly', () => {
    const { UNSAFE_getByType, getByText } = render(<LoadingIndicator.FullScreen />);
    
    // Should have default "Loading..." message
    expect(getByText('Loading...')).toBeTruthy();
    
    // Get the root View component
    const container = UNSAFE_getByType('View');
    
    // Check if both fullScreen and overlay styles are applied
    const hasFullScreenStyle = container.props.style.some(
      style => style && style.position === 'absolute'
    );
    const hasOverlayStyle = container.props.style.some(
      style => style && style.backgroundColor === 'rgba(0, 0, 0, 0.3)'
    );
    
    expect(hasFullScreenStyle).toBeTruthy();
    expect(hasOverlayStyle).toBeTruthy();
  });

  it('renders Content preset correctly', () => {
    const { UNSAFE_getByType, getByText } = render(<LoadingIndicator.Content />);
    
    // Should have default "Loading..." message
    expect(getByText('Loading...')).toBeTruthy();
    
    // Get the root View component
    const container = UNSAFE_getByType('View');
    
    // The content style (minHeight: 200) is nested in the style array
    const hasContentStyle = container.props.style.some(style => {
      if (Array.isArray(style)) {
        return style.some(s => s && s.minHeight === 200);
      }
      return style && style.minHeight === 200;
    });
    
    expect(hasContentStyle).toBeTruthy();
  });

  it('allows message override in presets', () => {
    const customMessage = 'Custom loading message';
    const { getByText } = render(<LoadingIndicator.FullScreen message={customMessage} />);
    
    expect(getByText(customMessage)).toBeTruthy();
  });
}); 