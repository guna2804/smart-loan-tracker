import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface GlobalLoaderContextType {
  isLoading: boolean;
  loadingMessage: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider');
  }
  return context;
};

interface GlobalLoaderProviderProps {
  children: ReactNode;
}

export const GlobalLoaderProvider: React.FC<GlobalLoaderProviderProps> = ({ children }) => {
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoader = useCallback((message: string = 'Loading...') => {
    setLoadingCounter(prev => prev + 1);
    setLoadingMessage(message);
  }, []);

  const hideLoader = useCallback(() => {
    setLoadingCounter(prev => Math.max(0, prev - 1));
  }, []);

  const isLoading = loadingCounter > 0;

  return (
    <GlobalLoaderContext.Provider value={{ isLoading, loadingMessage, showLoader, hideLoader }}>
      {children}
    </GlobalLoaderContext.Provider>
  );
};