import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Switch, Text } from 'react-native-paper';
import { router } from 'expo-router';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useAuth } from '@/app/context/AuthContext';

// Validation schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SignInScreen() {
  const { signIn, error, loading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email, values.password, rememberMe);
      // On success, router will automatically navigate to home due to auth state change
    } catch (err) {
      // Error is handled by auth context
      console.log('Sign in failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          {/* Logo placeholder - replace with actual logo */}
          <Text style={styles.appName}>WayPoint</Text>
          <Text style={styles.appTagline}>Mobile Pet Grooming Management</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={handleSignIn}
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

              <TextInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
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

              <View style={styles.rememberMeContainer}>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                />
                <Text style={styles.rememberMeText}>Remember me</Text>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Sign In
              </Button>

              <View style={styles.linksContainer}>
                <Button
                  mode="text"
                  onPress={() => router.push('/auth/forgot-password')}
                  style={styles.textButton}
                >
                  Forgot Password?
                </Button>

                <Button
                  mode="text"
                  onPress={() => router.push('/auth/sign-up')}
                  style={styles.textButton}
                >
                  Create Account
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  rememberMeText: {
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  textButton: {
    marginVertical: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
}); 