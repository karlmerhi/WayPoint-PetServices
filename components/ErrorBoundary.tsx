import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import Constants from 'expo-constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: __DEV__, // Show details by default in development
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: __DEV__,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    // Log the error
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // If resetKey changes, reset the error boundary
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.reset();
    }
  }

  private reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <ErrorDisplay 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        showDetails={this.state.showDetails}
        toggleDetails={this.toggleDetails}
        reset={this.reset}
      />;
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  toggleDetails: () => void;
  reset: () => void;
}

const ErrorDisplay = ({ 
  error, 
  errorInfo, 
  showDetails, 
  toggleDetails, 
  reset 
}: ErrorDisplayProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText type="title" style={styles.title}>
        Something went wrong
      </ThemedText>
      
      <ThemedText style={styles.subtitle}>
        The app encountered an unexpected error. You can try refreshing the page or restarting the app.
      </ThemedText>

      <View style={styles.buttonContainer}>
        <Button 
          title="Try Again"
          variant="primary"
          onPress={reset}
          style={styles.button}
        />
      </View>

      {/* Toggle error details (mainly useful for developers) */}
      <TouchableOpacity onPress={toggleDetails} style={styles.detailsToggle}>
        <ThemedText type="link">
          {showDetails ? 'Hide technical details' : 'Show technical details'}
        </ThemedText>
      </TouchableOpacity>

      {showDetails && (
        <ScrollView style={styles.detailsContainer}>
          <ThemedText style={styles.errorName}>
            {error?.name}: {error?.message}
          </ThemedText>
          
          {error?.stack && (
            <ThemedText style={styles.stackTrace}>
              {error.stack}
            </ThemedText>
          )}
          
          {errorInfo?.componentStack && (
            <View style={styles.componentStackContainer}>
              <ThemedText style={styles.componentStackTitle}>
                Component Stack:
              </ThemedText>
              <ThemedText style={styles.componentStack}>
                {errorInfo.componentStack}
              </ThemedText>
            </View>
          )}
          
          <ThemedText style={styles.versionInfo}>
            App version: {Constants.expoConfig?.version || 'unknown'}
          </ThemedText>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
  detailsToggle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  errorName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stackTrace: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 16,
  },
  componentStackContainer: {
    marginBottom: 16,
  },
  componentStackTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  componentStack: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  versionInfo: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
    opacity: 0.6,
  },
}); 