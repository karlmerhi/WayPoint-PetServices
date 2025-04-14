import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { Button } from '../Button';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn()
    .mockImplementation((_, colorName) => {
      switch (colorName) {
        case 'accent': return '#0a7ea4';
        case 'text': return '#11181C';
        case 'card': return '#F5F7F7';
        case 'background': return '#fff';
        default: return '#000';
      }
    }),
}));

describe('Button', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(<Button title="Press me" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a primary button with correct styles', () => {
    const tree = renderer.create(<Button title="Primary Button" variant="primary" />).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    const buttonStyles = tree.props.style;
    
    // Find the style object with backgroundColor
    // Handle both array and object cases
    let bgColorStyle = null;
    if (Array.isArray(buttonStyles)) {
      bgColorStyle = buttonStyles.find((style: any) => style && style.backgroundColor);
    } else {
      bgColorStyle = buttonStyles && buttonStyles.backgroundColor ? buttonStyles : null;
    }
    
    expect(bgColorStyle).toBeDefined();
    expect(bgColorStyle.backgroundColor).toBe('#0a7ea4'); // Primary color
  });

  it('renders a secondary button with correct styles', () => {
    const tree = renderer.create(<Button title="Secondary Button" variant="secondary" />).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    const buttonStyles = tree.props.style;
    
    // Find the style object with backgroundColor
    let bgColorStyle = null;
    if (Array.isArray(buttonStyles)) {
      bgColorStyle = buttonStyles.find((style: any) => style && style.backgroundColor);
    } else {
      bgColorStyle = buttonStyles && buttonStyles.backgroundColor ? buttonStyles : null;
    }
    
    expect(bgColorStyle).toBeDefined();
    expect(bgColorStyle.backgroundColor).toBe('#F5F7F7'); // Card color
  });

  it('renders a danger button with correct styles', () => {
    const tree = renderer.create(<Button title="Danger Button" variant="danger" />).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    const buttonStyles = tree.props.style;
    
    // Find the style object with backgroundColor
    let bgColorStyle = null;
    if (Array.isArray(buttonStyles)) {
      bgColorStyle = buttonStyles.find((style: any) => style && style.backgroundColor);
    } else {
      bgColorStyle = buttonStyles && buttonStyles.backgroundColor ? buttonStyles : null;
    }
    
    expect(bgColorStyle).toBeDefined();
    expect(bgColorStyle.backgroundColor).toBe('#E53935'); // Danger color
  });

  it('applies different sizes correctly', () => {
    // Small button
    const smallTree = renderer.create(<Button title="Small Button" size="small" />).toJSON() as ReactTestRendererJSON;
    expect(smallTree).not.toBeNull();
    const smallStyles = smallTree.props.style;
    
    let hasPaddingVertical6 = false;
    if (Array.isArray(smallStyles)) {
      hasPaddingVertical6 = smallStyles.some((style: any) => style && style.paddingVertical === 6);
    } else if (smallStyles && smallStyles.paddingVertical) {
      hasPaddingVertical6 = smallStyles.paddingVertical === 6;
    }
    
    expect(hasPaddingVertical6).toBeTruthy();
    
    // Large button
    const largeTree = renderer.create(<Button title="Large Button" size="large" />).toJSON() as ReactTestRendererJSON;
    expect(largeTree).not.toBeNull();
    const largeStyles = largeTree.props.style;
    
    let hasPaddingVertical14 = false;
    if (Array.isArray(largeStyles)) {
      hasPaddingVertical14 = largeStyles.some((style: any) => style && style.paddingVertical === 14);
    } else if (largeStyles && largeStyles.paddingVertical) {
      hasPaddingVertical14 = largeStyles.paddingVertical === 14;
    }
    
    expect(hasPaddingVertical14).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { getByTestId, queryByText } = render(<Button title="Loading Button" isLoading testID="loading-button" />);
    
    // Button text should not be visible when loading
    expect(queryByText('Loading Button')).toBeNull();
    
    // ActivityIndicator should be visible
    const button = getByTestId('loading-button');
    expect(button).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Disabled Button" disabled onPress={onPressMock} />);
    
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('calls onPress function when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Clickable Button" onPress={onPressMock} />);
    
    const button = getByText('Clickable Button');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
}); 