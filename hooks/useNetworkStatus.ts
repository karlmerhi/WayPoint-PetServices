import { useNetwork } from '../app/context/NetworkContext';

/**
 * Custom hook for accessing network connectivity status
 * @returns Network status object with convenient properties
 */
export function useNetworkStatus() {
  const networkState = useNetwork();
  
  return {
    // Basic connection status
    isConnected: networkState.isConnected,
    isOffline: !networkState.isConnected,
    
    // More detailed connection information
    isInternetReachable: networkState.isInternetReachable,
    connectionType: networkState.connectionType,
    
    // Helper properties
    isWifi: networkState.connectionType === 'wifi',
    isCellular: networkState.connectionType === 'cellular',
    isUnknownConnection: networkState.connectionType === 'unknown',
    isNoneConnection: networkState.connectionType === 'none',
    
    // Raw connection details
    connectionDetails: networkState.connectionDetails,
    lastChecked: networkState.lastChecked,
  };
}

export default useNetworkStatus; 