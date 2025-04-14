import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemedView } from '../ThemedView';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockImplementation(() => '#fff'),
}));

describe('ThemedView', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(<ThemedView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('renders correctly with children', () => {
    const tree = renderer.create(
      <ThemedView>
        <View testID="child-view" />
      </ThemedView>
    ).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.children).toHaveLength(1);
  });

  it('applies background color from theme', () => {
    const tree = renderer.create(<ThemedView />).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.props.style[0]).toHaveProperty('backgroundColor', '#fff');
  });

  it('merges custom styles with theme styles', () => {
    const customStyle = { margin: 10, padding: 5 };
    const tree = renderer.create(<ThemedView style={customStyle} />).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree.props.style).toEqual([{ backgroundColor: '#fff' }, customStyle]);
  });
}); 