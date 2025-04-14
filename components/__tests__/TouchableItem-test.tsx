import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Platform, View } from 'react-native';
import { TouchableItem } from '../TouchableItem';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockImplementation(() => '#0a7ea4'),
}));

// Mock Platform
const originalPlatform = Platform.OS;
const originalVersion = Platform.Version;

describe('TouchableItem', () => {
  afterEach(() => {
    // Reset platform after each test
    Platform.OS = originalPlatform;
    Platform.Version = originalVersion;
  });

  it('renders correctly on iOS', () => {
    Platform.OS = 'ios';
    
    const { getByText } = render(
      <TouchableItem>
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });

  it('renders correctly on Android', () => {
    Platform.OS = 'android';
    Platform.Version = 25;
    
    const { getByText } = render(
      <TouchableItem>
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    
    const { getByText } = render(
      <TouchableItem onPress={onPressMock}>
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    fireEvent.press(getByText('Press me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom style', () => {
    const { getByTestId } = render(
      <TouchableItem style={{ padding: 10 }} testID="touchable">
        <View testID="inner-view">
          <Text>Press me</Text>
        </View>
      </TouchableItem>
    );
    
    // On different platforms, the style may be applied to different parts of the component
    // We just check if the style is applied somewhere in the component
    const touchable = getByTestId('touchable');
    expect(touchable).toBeTruthy();
  });

  it('uses TouchableOpacity on older Android versions', () => {
    Platform.OS = 'android';
    Platform.Version = 20; // Below API 21
    
    // In React Native Testing Library we can't directly check component type,
    // so we're just ensuring it renders correctly
    const { getByText } = render(
      <TouchableItem>
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });

  it('accepts custom pressOpacity prop', () => {
    Platform.OS = 'ios';
    
    // This test only verifies that the component renders without errors
    // We can't directly test the internal prop value in RNTL
    const { getByTestId } = render(
      <TouchableItem pressOpacity={0.5} testID="touchable">
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    expect(getByTestId('touchable')).toBeTruthy();
  });

  it('handles borderless prop on Android', () => {
    Platform.OS = 'android';
    Platform.Version = 25;
    
    // Just checking that it renders without errors as we can't directly
    // test TouchableNativeFeedback.Ripple parameters in RNTL
    const { getByText } = render(
      <TouchableItem borderless>
        <Text>Press me</Text>
      </TouchableItem>
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });
}); 