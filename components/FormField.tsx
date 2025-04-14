import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from './TextInput';
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';

export interface FormFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: string;
  disabled?: boolean;
  formatOnBlur?: boolean;
}

export const FormField = forwardRef<any, FormFieldProps>(
  ({ name, disabled, formatOnBlur = false, onBlur, ...rest }, ref) => {
    // Use Formik's useField hook to connect the input to Formik state
    const [field, meta, helpers]: [
      FieldInputProps<any>,
      FieldMetaProps<any>,
      FieldHelperProps<any>
    ] = useField(name);

    const hasError = Boolean(meta.touched && meta.error);

    // Handle text change
    const handleChange = (text: string) => {
      helpers.setValue(text);
    };

    // Handle blur event
    const handleBlur = (e: any) => {
      field.onBlur(name);
      
      if (formatOnBlur && field.value) {
        // If formatOnBlur is true, format the value on blur
        // This can be useful for things like currency, phone numbers, etc.
        // You can extend this with specific formatters if needed
        helpers.setValue(field.value.trim());
      }
      
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <TextInput
        ref={ref}
        value={field.value}
        onChangeText={handleChange}
        onBlur={handleBlur}
        error={hasError ? meta.error : undefined}
        disabled={disabled}
        editable={!disabled}
        {...rest}
      />
    );
  }
);

FormField.displayName = 'FormField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
}); 