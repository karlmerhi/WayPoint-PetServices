import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemedText } from '../ThemedText';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockImplementation(() => '#11181C'),
}));

describe('ThemedText', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('renders correctly with type="title"', () => {
    const tree = renderer.create(<ThemedText type="title">Title Text</ThemedText>).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree).toHaveProperty('props.style');
    // Check if the style array includes an object that has a fontSize property
    expect(tree.props.style.some((style: any) => style && style.fontSize === 32)).toBeTruthy();
  });

  it('renders correctly with type="subtitle"', () => {
    const tree = renderer.create(<ThemedText type="subtitle">Subtitle Text</ThemedText>).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree).toHaveProperty('props.style');
    expect(tree.props.style.some((style: any) => style && style.fontSize === 20)).toBeTruthy();
  });

  it('renders correctly with custom style', () => {
    const customStyle = { marginBottom: 10, paddingHorizontal: 5 };
    const tree = renderer.create(<ThemedText style={customStyle}>Custom Style</ThemedText>).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree).toHaveProperty('props.style');
    expect(tree.props.style.includes(customStyle)).toBeTruthy();
  });

  it('renders link type with correct color', () => {
    const tree = renderer.create(<ThemedText type="link">Link Text</ThemedText>).toJSON() as ReactTestRendererJSON;
    expect(tree).not.toBeNull();
    expect(tree).toHaveProperty('props.style');
    // Look for the link style object in the style array
    expect(tree.props.style.some((style: any) => style && style.color === '#0a7ea4')).toBeTruthy();
  });
}); 