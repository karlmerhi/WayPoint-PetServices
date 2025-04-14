import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormField } from '../FormField';
import { View, Text, Button } from 'react-native';

// Mock the useThemeColor hook (needed for TextInput component used by FormField)
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

// Helper component to test FormField in a Formik context
const TestForm = ({ 
  initialValues = { email: '' },
  validationSchema,
  onSubmit = jest.fn(),
  children 
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => (
      <View>
        {children}
        <Button title="Submit" onPress={handleSubmit} testID="submit-button" />
      </View>
    )}
  </Formik>
);

describe('FormField', () => {
  it('renders correctly with basic props', () => {
    const { getByPlaceholderText } = render(
      <TestForm>
        <FormField name="email" placeholder="Enter email" />
      </TestForm>
    );
    
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('updates form values when text changes', async () => {
    const handleSubmit = jest.fn();
    
    const { getByPlaceholderText, getByTestId } = render(
      <TestForm onSubmit={handleSubmit}>
        <FormField name="email" placeholder="Enter email" />
      </TestForm>
    );
    
    const input = getByPlaceholderText('Enter email');
    
    await act(async () => {
      fireEvent.changeText(input, 'test@example.com');
    });
    
    const submitButton = getByTestId('submit-button');
    
    await act(async () => {
      fireEvent.press(submitButton);
    });
    
    expect(handleSubmit).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      expect.anything()
    );
  });

  it('shows validation errors', async () => {
    const validationSchema = Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    });
    
    const { getByPlaceholderText, getByTestId, findByText } = render(
      <TestForm validationSchema={validationSchema}>
        <FormField name="email" placeholder="Enter email" />
      </TestForm>
    );
    
    // Enter invalid email
    const input = getByPlaceholderText('Enter email');
    
    await act(async () => {
      fireEvent.changeText(input, 'invalid-email');
    });
    
    // Need to trigger blur to mark field as touched
    await act(async () => {
      fireEvent(input, 'blur');
    });
    
    // Submit form to trigger validation
    const submitButton = getByTestId('submit-button');
    await act(async () => {
      fireEvent.press(submitButton);
    });
    
    // Wait for the error message to appear
    const errorMessage = await findByText('Invalid email address');
    expect(errorMessage).toBeTruthy();
  });

  it('formats value on blur when formatOnBlur is true', async () => {
    const handleSubmit = jest.fn();
    
    const { getByPlaceholderText, getByTestId } = render(
      <TestForm onSubmit={handleSubmit} initialValues={{ name: '' }}>
        <FormField name="name" placeholder="Enter name" formatOnBlur />
      </TestForm>
    );
    
    // Enter text with whitespace
    const input = getByPlaceholderText('Enter name');
    
    await act(async () => {
      fireEvent.changeText(input, '  John Doe  ');
    });
    
    // Trigger blur to format
    await act(async () => {
      fireEvent(input, 'blur');
    });
    
    // Submit form
    const submitButton = getByTestId('submit-button');
    
    await act(async () => {
      fireEvent.press(submitButton);
    });
    
    // Should have trimmed the value
    expect(handleSubmit).toHaveBeenCalledWith(
      { name: 'John Doe' },
      expect.anything()
    );
  });

  it('respects disabled prop', () => {
    const { getByPlaceholderText } = render(
      <TestForm>
        <FormField name="email" placeholder="Enter email" disabled />
      </TestForm>
    );
    
    const input = getByPlaceholderText('Enter email');
    expect(input.props.editable).toBe(false);
  });
}); 