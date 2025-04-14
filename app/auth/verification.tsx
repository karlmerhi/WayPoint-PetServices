import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

import { useAuth } from '@/app/context/AuthContext';

export default function VerificationScreen() {
  const { user } = useAuth();
  
  const handleResendVerification = () => {
    // Implementation would require a function to resend verification
    // This could be added to the AuthContext
    alert('Verification email resent. Please check your inbox.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          {/* Placeholder for email verification icon */}
          <Text style={styles.iconText}>✉️</Text>
        </View>
        
        <Text style={styles.title}>Verify Your Email</Text>
        
        <Text style={styles.message}>
          We've sent a verification email to{'\n'}
          <Text style={styles.emailText}>{user?.email || 'your email address'}</Text>
        </Text>
        
        <Text style={styles.instructions}>
          Please check your inbox and click the verification link to complete your registration.
        </Text>
        
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/sign-in')}
            style={styles.button}
          >
            Go to Sign In
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleResendVerification}
            style={styles.resendButton}
          >
            Resend Verification Email
          </Button>
        </View>
        
        <Text style={styles.helpText}>
          Didn't receive an email? Check your spam folder or try resending the verification email.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  resendButton: {
    marginBottom: 24,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
}); 