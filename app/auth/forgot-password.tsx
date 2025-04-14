import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { router } from 'expo-router';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useAuth } from '@/app/context/AuthContext';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ForgotPasswordScreen() {
  const { resetPassword, error, loading } = useAuth();
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (values: { email: string }) => {
    try {
      await resetPassword(values.email);
      setResetSent(true);
    } catch (err) {
      // Error is handled by auth context
      console.log('Password reset failed:', err);
    }
  };

  if (resetSent) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.successTitle}>Reset Email Sent</Text>
          <Text style={styles.successText}>
            We've sent password reset instructions to your email. Please check your inbox.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/sign-in')}
            style={styles.button}
          >
            Back to Sign In
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <Text style={styles.headerSubtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                mode="outlined"
                style={styles.input}
                error={!!(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Reset Password
              </Button>

              <Button
                mode="text"
                onPress={() => router.push('/auth/sign-in')}
                style={styles.textButton}
              >
                Back to Sign In
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  textButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
}); 