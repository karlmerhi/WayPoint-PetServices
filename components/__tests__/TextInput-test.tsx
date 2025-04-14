import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { TextInput } from '../TextInput';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn()
    .mockImplementation((_, colorName) => {
      switch (colorName) {
        case 'card': return '#F5F7F7';
        case 'text': return '#11181C';
        case 'placeholderText': return '#889096';
        case 'accent': return '#0a7ea4';
        default: return '#000';
      }
    }),
}));

describe('TextInput', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Enter text" />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with a label', () => {
    const { getByText, getByPlaceholderText } = render(
      <TextInput label="Username" placeholder="Enter username" />
    );
    
    expect(getByText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
  });

  it('displays an error message', () => {
    const { getByText } = render(
      <TextInput 
        label="Email" 
        placeholder="Enter email"
        error="Please enter a valid email"
      />
    );
    
    expect(getByText('Please enter a valid email')).toBeTruthy();
  });

  it('displays helper text when provided', () => {
    const { getByText } = render(
      <TextInput 
        label="Password" 
        placeholder="Enter password"
        helperText="Password must be at least 8 characters"
      />
    );
    
    expect(getByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('prioritizes error over helper text', () => {
    const { getByText, queryByText } = render(
      <TextInput 
        label="Password" 
        placeholder="Enter password"
        helperText="Password must be at least 8 characters"
        error="Password is too short"
      />
    );
    
    expect(getByText('Password is too short')).toBeTruthy();
    expect(queryByText('Password must be at least 8 characters')).toBeNull();
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <TextInput 
        placeholder="Search"
        leftIcon={<View testID="left-icon" />}
      />
    );
    
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByTestId } = render(
      <TextInput 
        placeholder="Search"
        rightIcon={<View testID="right-icon" />}
      />
    );
    
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <TextInput 
        placeholder="Enter text"
        onChangeText={onChangeTextMock}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'new text');
    
    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });

  it('calls onRightIconPress when right icon is pressed', () => {
    const onRightIconPressMock = jest.fn();
    const { getByTestId } = render(
      <TextInput 
        placeholder="Password"
        rightIcon={<View testID="right-icon" />}
        onRightIconPress={onRightIconPressMock}
      />
    );
    
    fireEvent.press(getByTestId('right-icon'));
    expect(onRightIconPressMock).toHaveBeenCalledTimes(1);
  });

  it('calls onLeftIconPress when left icon is pressed', () => {
    const onLeftIconPressMock = jest.fn();
    const { getByTestId } = render(
      <TextInput 
        placeholder="Search"
        leftIcon={<View testID="left-icon" />}
        onLeftIconPress={onLeftIconPressMock}
      />
    );
    
    fireEvent.press(getByTestId('left-icon'));
    expect(onLeftIconPressMock).toHaveBeenCalledTimes(1);
  });
}); 