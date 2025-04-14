import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase';
import { storeData, getData, removeData } from '../utils/storage';

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_AUTH_KEY = 'auth_user';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    initialized: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we should auto-login from storage
        const rememberMe = await getData<boolean>(REMEMBER_ME_KEY, false);
        
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // If we have a user, store it if remember me is enabled
            if (rememberMe) {
              await storeData(USER_AUTH_KEY, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              });
            }
          } else {
            // If no user, try to restore from storage if remember me was enabled
            const storedUser = rememberMe ? await getData(USER_AUTH_KEY) : null;
            if (storedUser && rememberMe) {
              // Note: This doesn't actually log the user in again, just restores UI state
              // The Firebase auth session needs to be valid
              console.log('Restoring user from storage:', storedUser);
            }
          }
          
          setState(prev => ({
            ...prev,
            user,
            initialized: true,
            loading: false,
          }));
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setState(prev => ({
          ...prev,
          initialized: true,
          loading: false,
          error: 'Failed to initialize authentication'
        }));
      }
    };
    
    initializeAuth();
  }, []);
  
  const signIn = async (email: string, password: string, rememberMe = false): Promise<UserCredential> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Store remember me preference
      await storeData(REMEMBER_ME_KEY, rememberMe);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to sign in';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      return result;
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to sign up';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to reset password';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      
      await updateProfile(auth.currentUser, data);
      
      // Update local state to reflect changes
      setState(prev => ({ 
        ...prev, 
        user: auth.currentUser,
        loading: false 
      }));
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to update profile';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await signOut(auth);
      
      // Clear stored user data
      await removeData(USER_AUTH_KEY);
      
      setState(prev => ({ 
        ...prev, 
        user: null,
        loading: false 
      }));
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to sign out';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };
  
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };
  
  const value = {
    ...state,
    signIn,
    signUp,
    resetPassword,
    updateUserProfile,
    logout,
    clearError,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 