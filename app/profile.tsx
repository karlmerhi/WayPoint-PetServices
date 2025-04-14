import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput, Text, Avatar, Divider, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/app/context/AuthContext';

// Validation schema
const ProfileSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ProfileScreen() {
  const { user, updateUserProfile, logout, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const handleUpdateProfile = async (values: { displayName: string; email: string }) => {
    try {
      await updateUserProfile({ displayName: values.displayName });
      // Note: Changing email would require special Firebase Auth handling
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile');
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/sign-in');
    } catch (err) {
      console.error('Failed to log out:', err);
      alert('Failed to log out');
    }
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Here we would upload the image to Firebase Storage
        // For now, just show an alert
        alert('Image selected! Uploading functionality will be implemented soon.');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      alert('Failed to pick image');
    }
  };

  // Use placeholder data if user is not available
  const initialValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Avatar.Image 
              source={{ uri: user.photoURL }} 
              size={80} 
            />
          ) : (
            <Avatar.Text 
              size={80} 
              label={user?.displayName?.substring(0, 2).toUpperCase() || '?'} 
            />
          )}
          <View style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✎</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.headerText}>
          {user?.displayName || 'Your Profile'}
        </Text>
        <Text style={styles.subHeaderText}>
          {user?.email || 'Sign in to manage your account'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleUpdateProfile}
          enableReinitialize
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              <TextInput
                label="Full Name"
                value={values.displayName}
                onChangeText={handleChange('displayName')}
                mode="outlined"
                style={styles.input}
                error={!!(touched.displayName && errors.displayName)}
              />
              {touched.displayName && errors.displayName && (
                <Text style={styles.errorText}>{errors.displayName}</Text>
              )}
              
              <TextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                style={styles.input}
                disabled={true} // Email change requires special handling
                error={!!(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Update Profile
              </Button>
            </View>
          )}
        </Formik>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <Text>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <Button
          mode="outlined"
          onPress={() => router.push('/auth/change-password')}
          style={styles.securityButton}
        >
          Change Password
        </Button>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#B00020"
        >
          Log Out
        </Button>
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>WayPoint v0.1.3</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginVertical: 16,
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    color: 'white',
    fontSize: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  securityButton: {
    marginVertical: 8,
  },
  logoutButton: {
    borderColor: '#B00020',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
}); 