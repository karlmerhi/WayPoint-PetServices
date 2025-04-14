import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { Text, View } from 'react-native';
import { Card } from '../Card';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn()
    .mockImplementation((_, colorName) => {
      switch (colorName) {
        case 'card': return '#F5F7F7';
        case 'text': return '#11181C';
        case 'placeholderText': return '#889096';
        default: return '#000';
      }
    }),
}));

describe('Card', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(
      <Card>
        <Text>Card content</Text>
      </Card>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with title and subtitle', () => {
    const { getByText } = render(
      <Card title="Card Title" subtitle="Card Subtitle">
        <Text>Card content</Text>
      </Card>
    );
    
    expect(getByText('Card Title')).toBeTruthy();
    expect(getByText('Card Subtitle')).toBeTruthy();
    expect(getByText('Card content')).toBeTruthy();
  });

  it('renders with header right content', () => {
    const { getByText, getByTestId } = render(
      <Card 
        title="Card Title" 
        headerRight={<View testID="header-right"><Text>Action</Text></View>}
      >
        <Text>Card content</Text>
      </Card>
    );
    
    expect(getByText('Card Title')).toBeTruthy();
    expect(getByTestId('header-right')).toBeTruthy();
    expect(getByText('Action')).toBeTruthy();
  });

  it('renders with footer', () => {
    const { getByText, getByTestId } = render(
      <Card 
        title="Card Title" 
        footer={<View testID="footer"><Text>Footer content</Text></View>}
      >
        <Text>Card content</Text>
      </Card>
    );
    
    expect(getByText('Card Title')).toBeTruthy();
    expect(getByTestId('footer')).toBeTruthy();
    expect(getByText('Footer content')).toBeTruthy();
  });

  it('applies different elevation styles', () => {
    // 'none' elevation
    const noneTree = renderer.create(
      <Card elevation="none">
        <Text>Card content</Text>
      </Card>
    ).toJSON() as ReactTestRendererJSON;
    expect(noneTree).not.toBeNull();
    
    // 'large' elevation
    const largeTree = renderer.create(
      <Card elevation="large">
        <Text>Card content</Text>
      </Card>
    ).toJSON() as ReactTestRendererJSON;
    expect(largeTree).not.toBeNull();
    
    // Check if large elevation contains higher shadow values
    const largeStyles = largeTree.props.style;
    expect(largeStyles.some((style: any) => 
      style && style.shadowOpacity && style.shadowOpacity > 0.15
    )).toBeTruthy();
  });

  it('calls onPress function when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card title="Clickable Card" onPress={onPressMock}>
        <Text>Card content</Text>
      </Card>
    );
    
    fireEvent.press(getByText('Clickable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
}); 