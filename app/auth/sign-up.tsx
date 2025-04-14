import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { router } from 'expo-router';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useAuth } from '@/app/context/AuthContext';

// Validation schema
const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function SignUpScreen() {
  const { signUp, error, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (values: { name: string; email: string; password: string }) => {
    try {
      await signUp(values.email, values.password, values.name);
      router.push('/auth/verification');
    } catch (err) {
      // Error is handled by auth context
      console.log('Sign up failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Sign up to start managing your pet grooming business</Text>
        </View>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <TextInput
                label="Full Name"
                value={values.name}
                onChangeText={handleChange('name')}
                mode="outlined"
                style={styles.input}
                error={!!(touched.name && errors.name)}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

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

              <TextInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                mode="outlined"
                style={styles.input}
                error={!!(touched.password && errors.password)}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                mode="outlined"
                style={styles.input}
                error={!!(touched.confirmPassword && errors.confirmPassword)}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Text style={styles.termsText}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Create Account
              </Button>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <Button
                  mode="text"
                  onPress={() => router.push('/auth/sign-in')}
                  style={styles.textButton}
                >
                  Sign In
                </Button>
              </View>
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
  },
  headerContainer: {
    marginTop: 40,
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
  termsText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#666',
  },
  textButton: {
    marginLeft: 4,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
}); 