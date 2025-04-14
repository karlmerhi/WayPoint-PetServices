import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { router } from 'expo-router';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

import { useAuth } from '@/app/context/AuthContext';

// Validation schema
const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (values: { 
    currentPassword: string; 
    newPassword: string;
  }) => {
    if (!user || !user.email) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        user.email,
        values.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, values.newPassword);
      
      setSuccess(true);
    } catch (err) {
      console.error('Failed to change password:', err);
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          setError('Current password is incorrect');
        } else {
          setError(err.message || 'Failed to change password');
        }
      } else {
        setError('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.successTitle}>Password Changed</Text>
          <Text style={styles.successText}>
            Your password has been successfully updated.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.button}
          >
            Back to Profile
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
          <Text style={styles.headerTitle}>Change Password</Text>
          <Text style={styles.headerSubtitle}>
            Enter your current password and a new password to update your credentials.
          </Text>
        </View>

        <Formik
          initialValues={{ 
            currentPassword: '', 
            newPassword: '', 
            confirmPassword: '' 
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <TextInput
                label="Current Password"
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                mode="outlined"
                style={styles.input}
                error={!!(touched.currentPassword && errors.currentPassword)}
                right={
                  <TextInput.Icon
                    icon={showCurrentPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                }
              />
              {touched.currentPassword && errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}

              <TextInput
                label="New Password"
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                mode="outlined"
                style={styles.input}
                error={!!(touched.newPassword && errors.newPassword)}
                right={
                  <TextInput.Icon
                    icon={showNewPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                }
              />
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              <TextInput
                label="Confirm New Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
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

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Update Password
              </Button>

              <Button
                mode="text"
                onPress={() => router.back()}
                style={styles.cancelButton}
              >
                Cancel
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
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 24,
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
  cancelButton: {
    marginTop: 8,
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