import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  connectionDetails: NetInfoState | null;
  lastChecked: Date | null;
}

const initialNetworkState: NetworkContextType = {
  isConnected: false,
  isInternetReachable: null,
  connectionType: null,
  connectionDetails: null,
  lastChecked: null,
};

const NetworkContext = createContext<NetworkContextType>(initialNetworkState);

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>(initialNetworkState);

  useEffect(() => {
    // Function to update network state with the latest info
    const updateNetworkState = (state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected !== null ? state.isConnected : false,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
        connectionDetails: state,
        lastChecked: new Date(),
      });
    };

    // Initial check
    NetInfo.fetch().then(updateNetworkState);

    // Subscribe to network changes
    const unsubscribe: NetInfoSubscription = NetInfo.addEventListener(updateNetworkState);

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext; 